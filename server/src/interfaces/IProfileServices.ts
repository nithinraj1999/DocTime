import { IUser } from "../entities/user";

export interface IProfileServices {
  updateProfile(id: string , data: Partial<IUser>): Promise<IUser>;
  getProfile(id: string): Promise<IUser | null>;
}
 