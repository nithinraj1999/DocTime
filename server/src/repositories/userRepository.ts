import { injectable } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../interfaces/IUserRepository';
import { IUser } from '../entities/user';
export interface ICreateUserDTO {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

@injectable()
export class UserRepository implements IUserRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(user: ICreateUserDTO): Promise<IUser> {
    const newUser = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password ,
        phoneNumber: user.phoneNumber,
      },
    });
    return newUser as IUser;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user as IUser;
  }


}