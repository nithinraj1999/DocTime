import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import jwt from 'jsonwebtoken'
import { IDoctorAuthService } from '../../interfaces/IDoctorAuthService'
@injectable()
export class DoctorAuthController {
    constructor(@inject('IDoctorAuthService') private authService: IDoctorAuthService) {}

    async signin(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body
            console.log(req.body)

            const user = await this.authService.signin(email, password)
            const accessToken = jwt.sign({ userId: user?.id, email: user?.email }, process.env.JWT_SECRET as string, {
                expiresIn: '1h'
            })

            res.cookie('doctorAccessToken', accessToken, {
                httpOnly: true,
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
}
