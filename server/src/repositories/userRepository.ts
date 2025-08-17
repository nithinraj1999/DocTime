import { injectable } from 'tsyringe'
import { PrismaClient } from '@prisma/client'
import { IUserRepository } from '../interfaces/IUserRepository'
import { IUser } from '../entities/user'

export interface ICreateUserDTO {
    name: string
    email: string
    password: string
    phoneNumber: string
    profileImage:null
}

@injectable()
export class UserRepository implements IUserRepository {
    private readonly prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    async create(user: ICreateUserDTO): Promise<Partial<IUser>> {
        const newUser = await this.prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
                phoneNumber: user.phoneNumber,
                profileImage:user.profileImage || null,
            }
        })
        return newUser
    }

    async findByEmail(email: string, isAdmin: boolean): Promise<Partial<IUser> | null> {
        const user = await this.prisma.user.findFirst({
            where: { email, isAdmin: isAdmin }
        })
        return user
    }

    async findById(id: string): Promise<Partial<IUser> | null> {
        const user = await this.prisma.user.findUnique({
            where: { id }
        })
        return user
    }

    async updateProfile(id: string, data: Partial<IUser>): Promise<Partial<IUser>> {
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data
        })
        console.log('Updated User:', updatedUser)

        return updatedUser
    }

    async updateProfileByEmail(email: string, data: Partial<IUser>): Promise<Partial<IUser>> {
        const updatedUser = await this.prisma.user.update({
            where: { email },
            data
        })
        console.log('Updated User:', updatedUser)

        return updatedUser
    }

    async getAllUsers(): Promise<IUser[]> {
        const users = await this.prisma.user.findMany()
        return users
    }
}
