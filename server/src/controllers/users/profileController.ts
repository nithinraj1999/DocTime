import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IProfileServices} from '../../interfaces/IProfileServices';
@injectable()
export class ProfileController {
  constructor(  
    @inject('IProfileServices') private profileService: IProfileServices
  ) {}

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const userData = req.body
      console.log(`Updating profile for user ID: ${userId}`, userData);
      
      if(!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }
      const updatedUser = await this.profileService.updateProfile(userId, userData);
      res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      if(!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }
      const user = await this.profileService.getProfile(userId);
      if (user) {
        res.status(200).json({ message: 'Profile retrieved successfully', user });
      } else {
        res.status(404).json({ message: 'User not found' });
      }     
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

}
