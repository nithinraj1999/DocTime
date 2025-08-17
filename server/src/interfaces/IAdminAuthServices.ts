import { IUser } from "../entities/user";

export interface IAdminAuthService {
  signin(email: string, password: string): Promise<Partial<IUser> | null>;
}
 