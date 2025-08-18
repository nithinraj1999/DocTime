import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { IDoctorProfileServices } from '../../interfaces/IDoctorProfileServices'
import { success } from 'zod'

@injectable()
export class DoctorProfileController {
    constructor(
        @inject('IDoctorProfileServices')
        private doctorProfileService: IDoctorProfileServices
    ) {}

    async createDoctorProfile(req: Request, res: Response): Promise<void> {
        try {
            const doctorData = req.body
            const newDoctor = await this.doctorProfileService.createDoctorProfile(doctorData)

            res.status(201).json({
                success: true,
                message: 'Doctor profile created successfully',
                doctor: newDoctor
            })
        } catch (error) {
            res.status(500).json({ message: (error as Error).message })
        }
    }
    async updateDoctorProfile(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = req.params.id
            const updateData = req.body

            if (!doctorId) {
                res.status(400).json({ message: 'Doctor ID is required' })
                return
            }

            const updatedDoctor = await this.doctorProfileService.updateProfile(doctorId, updateData)

            res.status(200).json({
                success: true,
                message: 'Doctor profile updated successfully',
                doctor: updatedDoctor
            })
        } catch (error) {
            res.status(500).json({ message: (error as Error).message })
        }
    }

    async getDoctorProfile(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = req.params.id
            console.log(doctorId);
            
            if (!doctorId) {
                res.status(400).json({ message: 'Doctor ID is required' })
                return
            }

            const doctorProfile = await this.doctorProfileService.getProfile(doctorId)
            console.log(doctorProfile);
            
            res.status(200).json({
                message: 'Doctor profile fetched successfully',
                doctor: doctorProfile
            })
        } catch (error) {
            res.status(500).json({ message: (error as Error).message })
        }
    
    }
}
