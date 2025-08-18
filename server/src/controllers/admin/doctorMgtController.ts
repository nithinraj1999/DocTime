import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { IDoctorMgtService } from '../../interfaces/IDoctorMgtServices'
@injectable()
export class AdminDoctorMgtController {
    constructor(@inject('IDoctorMgtService') private doctorMgtService: IDoctorMgtService) {}

    async createDoctor(req: Request, res: Response): Promise<void> {
        try {
            const doctorData = req.body
            const newDoctor = await this.doctorMgtService.createDoctor(doctorData)
            res.status(201).json({ success: true, data: newDoctor })
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message })
        }
    }

    async updateDoctor(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = req.params.id
            const doctorData = req.body
            if (doctorId) {
                const updatedDoctor = await this.doctorMgtService.updateDoctor(doctorId, doctorData)
                res.status(200).json({ success: true, data: updatedDoctor })
            }
        } catch (error) {
            console.log(error);
            
            res.status(500).json({ success: false, message: (error as Error).message })
        }
    }

    async blockDoctor(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = req.params.id
            if (doctorId) {
                const blockedDoctor = await this.doctorMgtService.blockDoctor(doctorId)
                res.status(200).json({ success: true, data: blockedDoctor })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message })
        }
    }

    async unblockDoctor(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = req.params.id
            if (doctorId) {
                const unblockedDoctor = await this.doctorMgtService.unblockDoctor(doctorId)
                res.status(200).json({ success: true, data: unblockedDoctor })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message })
        }
    }

    async getAllDoctors(req: Request, res: Response): Promise<void> {
        try {
            const doctors = await this.doctorMgtService.getAllDoctors()
            res.status(200).json({ success: true, data: doctors })
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message })
        }
    }

    async getDoctorById(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = req.params.id
            if (doctorId) {
                const doctor = await this.doctorMgtService.getDoctorById(doctorId)
                res.status(200).json({ success: true, data: doctor })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message })
        }
    }

    async getDoctorByEmail(req: Request, res: Response): Promise<void> {
        try {
            const email = req.query.email as string
            if (email) {
                const doctor = await this.doctorMgtService.getDoctorByEmail(email)
                res.status(200).json({ success: true, data: doctor })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message })
        }
    }
}
