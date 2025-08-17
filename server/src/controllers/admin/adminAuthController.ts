import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import jwt from 'jsonwebtoken'
import { IAdminAuthService } from '../../interfaces/IAdminAuthServices'

@injectable()
export class AdminAuthController {
    constructor(@inject('IAdminAuthService') private authService: IAdminAuthService) {}

    async signin(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body
            const user = await this.authService.signin(email, password)
            const accessToken = jwt.sign({ userId: user?.id, email: user?.email }, process.env.JWT_SECRET as string, {
                expiresIn: '1h'
            })

            res.cookie('adminAccessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000, 
                sameSite: 'lax'
            })

            res.status(200).json({ success: true, message: 'User signed in successfully', user: user })
        } catch (error) {
            res.status(500).json({ message: (error as Error).message })
        }
    }
}
