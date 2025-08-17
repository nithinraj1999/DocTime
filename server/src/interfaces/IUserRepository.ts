
import { IUser } from "../entities/user";
export interface IUserRepository {
  create(user: Partial<IUser>): Promise<Partial<IUser>>;
  findByEmail(email: string,isAdmin: boolean): Promise<Partial<IUser> | null>;
  findById(id: string): Promise<Partial<IUser> | null>;
  updateProfile(id: string, data: Partial<IUser>): Promise<Partial<IUser>>;
  updateProfileByEmail(email: string, data: Partial<IUser>): Promise<Partial<IUser>>
  getAllUsers(): Promise<IUser[]>;
}
