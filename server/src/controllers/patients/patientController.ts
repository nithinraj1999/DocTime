import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { IPatientServices } from '../../interfaces/IPatientServices'

@injectable()
export class PatientController {
    constructor(
        @inject('IPatientServices')
        private patientServices: IPatientServices
    ) {}

    async createPatient(req: Request, res: Response): Promise<void> {
        try {
            const patientData = req.body
            console.log(patientData);
            
            const newPatient = await this.patientServices.createPatient(patientData)
            res.status(201).json({ success: true, data: newPatient })
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    async getPatientById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            if (!id) {
                res.status(400).json({ success: false, message: 'Patient ID is required' })
                return
            }
            const patient = await this.patientServices.getPatientById(id)

            if (!patient) {
                res.status(404).json({ success: false, message: 'Patient not found' })
                return
            }

            res.status(200).json({ success: true, data: patient })
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message })
        }
    }

    async getPatientsByUserId(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params
            if (!userId) {
                res.status(400).json({ success: false, message: 'User ID is required' })
                return
            }
            const patients = await this.patientServices.getPatientByUserId(userId)

            if (!patients || patients.length === 0) {
                res.status(404).json({ success: false, message: 'No patients found' })
                return
            }

            res.status(200).json({ success: true, data: patients })
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message })
        }
    }

    async updatePatient(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const patientData = req.body
            if (!id) {
                res.status(400).json({ success: false, message: 'Patient ID is required' })
                return
            }
            const updatedPatient = await this.patientServices.updatePatient(id, patientData)

            res.status(200).json({ success: true, data: updatedPatient })
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //   async deletePatient(req: Request, res: Response): Promise<void> {
    //     try {
    //       const { id } = req.params;
    //       await this.patientServices.deletePatient(id);

    //       res.status(200).json({ success: true, message: "Patient deleted successfully" });
    //     } catch (error: any) {
    //       res.status(400).json({ success: false, message: error.message });
    //     }
    //   }
}
