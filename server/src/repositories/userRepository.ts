import { injectable } from 'tsyringe'
import { Prisma, PrismaClient } from '@prisma/client'
import { IUserRepository } from '../interfaces/IUserRepository'
import { IUser } from '../entities/user'

export interface ICreateUserDTO {
    name: string
    email: string
    password: string
    phoneNumber: string
    profileImage: null
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
                profileImage: user.profileImage || null
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

    async updateProfile(id: string, data: Partial<IUser>): Promise<IUser> {
        const { patient, ...rest } = data

        const updateData: Prisma.UserUpdateInput = {
            ...rest,
            ...(patient && {
                patient: {
                    update: {
                        ...patient
                    }
                }
            })
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
            include: { patient: true } 
        })

        return updatedUser as unknown as IUser 
    }

    async updateProfileByEmail(email: string, data: Partial<IUser>): Promise<Partial<IUser>> {
        const { patient, ...rest } = data

        const updateData: Prisma.UserUpdateInput = {
            ...rest,
            ...(patient && {
                patient: {
                    update: {
                        ...patient
                    }
                }
            })
        }

        const updatedUser = await this.prisma.user.update({
            where: { email },
            data: updateData,
            include: { patient: true }
        })
        console.log('Updated User:', updatedUser)

        return updatedUser as unknown as IUser
    }

    async getAllUsers(): Promise<IUser[]> {
        const users = await this.prisma.user.findMany()
        return users
    }
}
