
import { IUser } from "../entities/user";
export interface IUserRepository {
  create(user: Partial<IUser>): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  updateProfile(id: string, data: Partial<IUser>): Promise<IUser>;
}
