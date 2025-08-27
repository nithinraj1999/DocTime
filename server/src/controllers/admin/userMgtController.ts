import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { IUserMgtService } from '../../interfaces/IUserMgtServices'
@injectable()
export class AdminUserMgtController {
    constructor( @inject('IUserMgtService') private userMgtService: IUserMgtService) {}

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const userData = req.body
            console.log(".file...",req.file);
            const file = req.file
            const newUser = await this.userMgtService.createNewUser(userData,file)
            res.status(201).json({ success: true, data: newUser })
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message })
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id
            const file = req.file
            const userData = req.body
            if(userId){
            const updatedUser = await this.userMgtService.updateUser(userId, userData,file)
            res.status(200).json({ success: true, data: updatedUser })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}

    async blockUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id
            if(userId){
                const blockedUser = await this.userMgtService.blockUser(userId)
                res.status(200).json({ success: true, data: blockedUser })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message })
        }
    }

    async unblockUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id
            if(userId){
                const unblockedUser = await this.userMgtService.unblockUser(userId)
                res.status(200).json({ success: true, data: unblockedUser })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message })
        }
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
                const search = (req.query.search as string) || "";
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "10", 10);

            const { totalUsers, allUsers } = await this.userMgtService.getAllUsers(search, page, limit)
            res.status(200).json({ success: true, data: allUsers, total: totalUsers })
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message })
        }
    }
}
