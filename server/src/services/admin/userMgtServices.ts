import { inject, injectable } from 'tsyringe'
import { IUserRepository } from '../../interfaces/IUserRepository'
import bcrypt from 'bcrypt'
import { IUser } from '../../entities/user'
import { IUserMgtService } from '../../interfaces/IUserMgtServices'

@injectable()
export class UserMgtService implements IUserMgtService {
    constructor(@inject('IUserRepository') private userRepo: IUserRepository) {}

    async createNewUser(userData: Partial<IUser>): Promise<Partial<IUser>> {
        if (!userData.email || !userData.password) {
            throw new Error('Email and password are required')
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10)
        const newUser = await this.userRepo.create({
            ...userData,
            password: hashedPassword
        })
        return newUser
    }
    async updateUser(id: string, userData: Partial<IUser>): Promise<Partial<IUser>> {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10)
        }

        const updatedUser = await this.userRepo.updateProfile(id, {
            ...userData
        })

        return updatedUser
    }

    async blockUser(id: string): Promise<Partial<IUser>> {
        return this.userRepo.updateProfile(id, { status: 'BLOCKED' })
    }

    async unblockUser(id: string): Promise<Partial<IUser>> {
        return this.userRepo.updateProfile(id, { status: 'ACTIVE' })
    }

    async getAllUsers(): Promise<IUser[]> {
        return this.userRepo.getAllUsers()
    }
}
