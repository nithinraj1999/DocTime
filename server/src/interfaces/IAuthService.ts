import { IUser } from "../entities/user";

export interface IAuthService {
  signup(name: string, email: string, password: string, phoneNumber: string, confirmPassword: string): Promise<IUser>;
  signin(email: string, password: string): Promise<IUser>
  verifyOtp(phoneNumber: string, otp: string): Promise<boolean>
  resendOtp(email: string): Promise<void>
}
 