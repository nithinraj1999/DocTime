import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IAuthService } from '../../interfaces/IAuthService';

@injectable()
export class AuthController {
  constructor(  
    @inject('IAuthService') private authService: IAuthService
  ) {}
 
  async signup(req: Request, res: Response): Promise<void> {
    try {
        
      const { name, email, password, phoneNumber, confirmPassword } = req.body;
      await this.authService.signup(name, email, password, phoneNumber, confirmPassword);
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async signin(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body);
      
      const { email, password } = req.body;
      const user = await this.authService.signin(email, password);
      res.status(200).json({success:true, message: 'User signed in successfully', user:user});
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
}

async verifyOtp(req: Request, res: Response): Promise<void> {
  const { email, otp } = req.body;
  const isValid = await this.authService.verifyOtp(email, otp);
  if (isValid) {
    res.json({ success: true, message: 'OTP verified' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
}

}
