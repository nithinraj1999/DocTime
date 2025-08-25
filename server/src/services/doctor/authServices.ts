import { inject, injectable } from 'tsyringe'
import { IDoctorAuthService } from '../../interfaces/IDoctorAuthService'
import { IDoctorRepository } from '../../interfaces/IDoctorRepository'
import bcrypt from 'bcrypt'
import { IEmailService } from '../../config/nodeMailer'
import redis from '../../config/redis'
import { IDoctor } from '../../entities/doctor'

@injectable()
export class DoctorAuthService implements IDoctorAuthService {
    constructor(
        @inject('IDoctorRepository') private doctorRepo: IDoctorRepository,
        @inject('IEmailService') private emailService: IEmailService
    ) {}

    async signin(email: string, password: string): Promise<Partial<IDoctor> | null> {
        const user = await this.doctorRepo.findVerifiedByEmail(email)
        if (!user) {
            throw new Error('User not found')
        }
        if (user.password) {
            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid) {
                throw new Error('Invalid password')
            }
            return user
        }

        return null
    }

    async generateAndStoreOtp(email: string): Promise<string> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        console.log('otp ---', otp)

        await redis.setex(`otp:${email}`, 300, otp)
        return otp
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        console.log(email)
        const storedOtp = await redis.get(`otp:${email}`)
        if (storedOtp === otp) {
            await this.doctorRepo.updateDoctorByEmail(email, { isVerified: true })
        }
        return storedOtp === otp
    }

    async resendOtp(email: string): Promise<void> {
        const user = await this.doctorRepo.findByEmail(email)
        if (!user) {
            throw new Error('User with this phone number does not exist')
        }
        console.log('email', email)

        await redis.del(`otp:${email}`)

        const otp = await this.generateAndStoreOtp(email)
        if (user.email) {
            await this.emailService.sendEmail(user.email, otp)
        }
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.doctorRepo.findByEmail(email)
        if (!user) {
            throw new Error('User with this email does not exist')
        }
        const resetLink = process.env.FRONTEND_ORIGIN + `/doctor/reset-password?email=${encodeURIComponent(email)}`
        await this.emailService.sendEmailToResetPassword(email, resetLink)
    }
    async resetPassword(email: string, newPassword: string): Promise<Partial<IDoctor> | null> {
        const user = await this.doctorRepo.findByEmail(email)
        if (!user) {
            throw new Error('User with this email does not exist')
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await this.doctorRepo.updateDoctorByEmail(email, { password: hashedPassword })
        return user
    }
}
