import 'dotenv/config'
import jwt from 'jsonwebtoken'

export class JWTService  {
    private accessTokenSecret: string

    constructor() {
        this.accessTokenSecret =
            process.env.JWT_SECRET || 'defaultAccessSecret'
    }

    generateAccessToken(payload: {_id:string,role:string}): string {
        return jwt.sign(payload, this.accessTokenSecret, { expiresIn: '10d' })
    }


    verifyAccessToken(token: string): any {
        try {
            return jwt.verify(token, this.accessTokenSecret)
        } catch (err) {
            throw new Error('Invalid or expired access token')
        }
    }

 
}
