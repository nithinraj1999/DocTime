import { inject, injectable } from 'tsyringe'
import { IUserRepository } from '../../interfaces/IUserRepository'
import { IAdminAuthService } from '../../interfaces/IAdminAuthServices'
import bcrypt from 'bcrypt'
import { IUser } from '../../entities/user'

@injectable()
export class AdminAuthService implements IAdminAuthService {
    constructor(@inject('IUserRepository') private userRepo: IUserRepository) {}

    async signin(email: string, password: string): Promise<Partial<IUser> | null> {
        const user = await this.userRepo.findByEmail(email,true)
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
}
 