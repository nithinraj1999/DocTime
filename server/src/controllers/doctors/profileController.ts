import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { IDoctorProfileServices } from '../../interfaces/IDoctorProfileServices'

@injectable()
export class DoctorProfileController {
    constructor(
        @inject('IDoctorProfileServices')
        private doctorProfileService: IDoctorProfileServices
    ) {}

    async createDoctorProfile(req: Request, res: Response): Promise<void> {
        try {
            const doctorData = req.body

            console.log('Creating new doctor profile:', doctorData)

            const newDoctor = await this.doctorProfileService.createDoctorProfile(doctorData)

            res.status(201).json({
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
                message: 'Doctor profile updated successfully',
                doctor: updatedDoctor
            })
        } catch (error) {
            res.status(500).json({ message: (error as Error).message })
        }
    }
}
