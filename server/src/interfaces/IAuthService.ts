import { IUser } from "../entities/user";

export interface IAuthService {
  signup(name: string, email: string, password: string, phoneNumber: string, confirmPassword: string): Promise<Partial<IUser>>;
  signin(email: string, password: string): Promise<Partial<IUser> | null>;
  verifyOtp(phoneNumber: string, otp: string): Promise<boolean>;
  resendOtp(email: string): Promise<void>;
  forgetPassword(email: string): Promise<boolean>;
  resetPassword(email: string, newPassword: string): Promise<Partial<IUser> | null>;
}
 