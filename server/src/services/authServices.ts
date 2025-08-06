import { inject, injectable } from 'tsyringe'
import { IAuthService } from '../interfaces/IAuthService'
import { IUserRepository } from '../interfaces/IUserRepository'
import bcrypt from 'bcrypt'
import { IUser } from '../entities/user'
import { IEmailService } from '../config/nodeMailer'
import redis from '../config/redis'

@injectable()
export class AuthService implements IAuthService {
    constructor(
        @inject('IUserRepository') private userRepo: IUserRepository,
        @inject('IEmailService') private emailService: IEmailService
    ) {}

    async signup(
        name: string,
        email: string,
        password: string,
        phoneNumber: string,
        confirmPassword: string
    ): Promise<void> {
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match')
        }

        const existingUser = await this.userRepo.findByEmail(email)
        if (existingUser) {
            throw new Error('User with this email already exists')
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await this.userRepo.create({
            name,
            email,
            password: hashedPassword,
            phoneNumber
        })

        const otp = await this.generateAndStoreOtp(email)

        await this.emailService.sendEmail(email, otp)
    }

    async signin(email: string, password: string): Promise<IUser> {
        const user = await this.userRepo.findByEmail(email)
        if (!user) {
            throw new Error('User not found')
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new Error('Invalid password')
        }
        return user
    }

    async generateAndStoreOtp(phoneNumber: string): Promise<string> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        await redis.setex(`otp:${phoneNumber}`, 300, otp)
        return otp
    }

    async verifyOtp(phoneNumber: string, otp: string): Promise<boolean> {
        const storedOtp = await redis.get(`otp:${phoneNumber}`)
        return storedOtp === otp
    }

    async resendOtp(email: string): Promise<void> {
        const user = await this.userRepo.findByEmail(email)
        if (!user) {
            throw new Error('User with this phone number does not exist')
        }
        await redis.del(`otp:${email}`)

        const otp = await this.generateAndStoreOtp(email)

        await this.emailService.sendEmail(user.email, otp)
    }
}
