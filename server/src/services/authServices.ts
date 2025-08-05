import { inject, injectable } from 'tsyringe';
import { IAuthService } from '../interfaces/IAuthService';
import { IUserRepository } from '../interfaces/IUserRepository';
import bcrypt from 'bcrypt';
import {IUser} from '../entities/user'
@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject('IUserRepository') private userRepo : IUserRepository
  ) {}

  async signup(name: string, email: string, password: string, phoneNumber: string, confirmPassword: string): Promise<void> {
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepo.create({ name, email, password: hashedPassword, phoneNumber });
  }

  async signin(email: string, password: string): Promise<IUser> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    return user
  }
}
