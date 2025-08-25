import { Request, Response, NextFunction } from 'express'
import { JWTService } from '../config/jwt'

export interface CustomRequest extends Request {
    user: {
      _id:string,
      role:string
    }
}

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    try { 
        const token = req.cookies?.accessToken
        
        if (!token) {
            res.status(401).json({ message: 'Unauthorized: No token provided' })
            return
        }
        const jwt = new JWTService()
        const decoded = jwt.verifyAccessToken(token)
        if (decoded) {
            const customReq = req as CustomRequest
            customReq.user = decoded
        }

        next()
    } catch (error) {
        console.log("Invalid or expired token");
        res.status(403).json({ message: 'Invalid or expired token' })
    }   
}

export default authenticateUser
