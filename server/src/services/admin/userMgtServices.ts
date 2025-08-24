import { inject, injectable } from 'tsyringe'
import { IUserRepository } from '../../interfaces/IUserRepository'
import bcrypt from 'bcrypt'
import { IUser } from '../../entities/user'
import { IUserMgtService } from '../../interfaces/IUserMgtServices'
import { Prisma } from '@prisma/client'

@injectable()
export class UserMgtService implements IUserMgtService {
    constructor(@inject('IUserRepository') private userRepo: IUserRepository) {}

    async createNewUser(userData: Partial<IUser>): Promise<Partial<IUser> | null> {
        if (!userData.email || !userData.password) {
            throw new Error('Email and password are required')
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10)
        const newUser = await this.userRepo.create({
            ...userData,
            password: hashedPassword
        })
        let verifiedUser = null
        if (newUser && newUser.id) {
          console.log("New user created:", newUser);
            verifiedUser = await this.userRepo.updateProfile(newUser.id, { isVerified: true })
        }
        return verifiedUser
    }

async updateUser(id: string, userData: Partial<IUser>): Promise<IUser> {
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }

  const prismaData: any = {
    ...(userData.name && { name: userData.name }),
    ...(userData.email && { email: userData.email }),
    ...(userData.password && { password: userData.password }),
    ...(userData.status && { status: userData.status }),
    ...(userData.patient && {
      patient: {
        update: {
          ...userData.patient,
        },
      },
    }),
  };

  const updatedUser = await this.userRepo.updateProfile(id, prismaData);

  return updatedUser as unknown as IUser; // full object with id + required fields
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
