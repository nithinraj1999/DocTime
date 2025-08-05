import { IUser } from "../entities/user";

export interface IAuthService {
  signup(name: string, email: string, password: string, phoneNumber: string, confirmPassword: string): Promise<void>;
  signin(email: string, password: string): Promise<IUser>
}
 