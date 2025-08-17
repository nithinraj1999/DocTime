import { IUser } from "../entities/user";

export interface IProfileServices {
  updateProfile(id: string , data: Partial<IUser>): Promise<Partial<IUser>>;
  getProfile(id: string): Promise<Partial<IUser> | null>;
}
 