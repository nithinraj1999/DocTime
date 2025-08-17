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
    ): Promise<Partial<IUser>> {
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match')
        }

        const existingUser = await this.userRepo.findByEmail(email, false)
        if (existingUser) {
            throw new Error('User with this email already exists')
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await this.userRepo.create({
            name,
            email,
            password: hashedPassword,
            phoneNumber
        })

        const otp = await this.generateAndStoreOtp(email)

        await this.emailService.sendEmail(email, otp)
        return user
    }

    async signin(email: string, password: string): Promise<Partial<IUser> |null> {
        const user = await this.userRepo.findByEmail(email,false)
        if (!user) {
            throw new Error('User not found')
        }
        if(user.password){
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
        console.log("otp ---",otp);
        
        await redis.setex(`otp:${email}`, 300, otp)
        return otp
    }
  
    async verifyOtp(email: string, otp: string): Promise<boolean> {
        console.log(email)
        const storedOtp = await redis.get(`otp:${email}`)
        console.log(storedOtp)
        if (storedOtp === otp) {
            await this.userRepo.updateProfileByEmail(email, { isVerified: true })
        }
        return storedOtp === otp
    }

    async resendOtp(email: string): Promise<void> {
        const user = await this.userRepo.findByEmail(email,false)
        if (!user) {
            throw new Error('User with this phone number does not exist')
        }
        console.log("email",email);
        
        await redis.del(`otp:${email}`)

        const otp = await this.generateAndStoreOtp(email)
        if (user.email) {
            await this.emailService.sendEmail(user.email, otp)
        }
    }

}
 