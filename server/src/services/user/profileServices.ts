import { IProfileServices } from "../../interfaces/IProfileServices";
import { IUser } from "../../entities/user";
import { IUserRepository } from "../../interfaces/IUserRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class ProfileServices implements IProfileServices {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  async updateProfile(id: string, data: Partial<IUser>): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error('User not found');
    return await this.userRepository.updateProfile(id, data);
  }

  async getProfile(id: string): Promise<IUser | null> {
    return this.userRepository.findById(id);
  }
}