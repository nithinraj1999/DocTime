import { IDoctor } from "../entities/doctor";
export interface IDoctorAuthService {
  signin(email: string, password: string): Promise<Partial<IDoctor> | null>;
  verifyOtp(phoneNumber: string, otp: string): Promise<boolean>;
  resendOtp(email: string): Promise<void>;
}
 