import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { IAuthService } from '../../interfaces/IAuthService'
import jwt from 'jsonwebtoken'
import { IEmailService } from '../../config/nodeMailer'

@injectable()
export class AuthController {
    constructor(
        @inject('IAuthService') private authService: IAuthService,
        @inject('IEmailService') private emailService: IEmailService
    ) {}

    async signup(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password, phoneNumber, confirmPassword } = req.body
            const userData = await this.authService.signup(name, email, password, phoneNumber, confirmPassword)

            res.status(201).json({ success: true, message: 'User registered successfully', email: email })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: true, message: (error as Error).message })
        }
    }

    async signin(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body
            const user = await this.authService.signin(email, password)
            const accessToken = jwt.sign({ userId: user?.id, email: user?.email }, process.env.JWT_SECRET as string, {
                expiresIn: '1h'
            })

            res.cookie('accessToken', accessToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
                sameSite: 'lax'
            })

            res.status(200).json({ success: true, message: 'User signed in successfully', user: user })
        } catch (error) {
            res.status(500).json({ message: (error as Error).message })
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        console.log('verify otp controller ', req.body)

        const { email, otp } = req.body
        console.log(otp)

        const isValid = await this.authService.verifyOtp(email, otp)
        if (isValid) {
            res.json({ success: true, message: 'OTP verified' })
        } else {
            res.status(400).json({ success: false, message: 'Invalid OTP' })
        }
    }

    async resendOTP(req: Request, res: Response) {
        const { email } = req.body
        const resend = await this.authService.resendOtp(email)
        res.json({ success: true, message: 'OTP resend' })
    }
    async logout(req: Request, res: Response): Promise<void> {
        res.clearCookie('accessToken')
        res.json({ success: true, message: 'User logged out successfully' })
    }

    async forgetPassword(req: Request, res: Response): Promise<void> {
        console.log(req.body)

        const { email } = req.body
        const result = await this.authService.forgetPassword(email)
        res.json({ success: true, message: 'Password reset link sent', data: result })
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        const { email, newPassword, confirmPassword } = req.body
        console.log(req.body)

        if (newPassword !== confirmPassword) {
            res.status(400).json({ success: false, message: 'Passwords do not match' })
            return
        }

    }
}
