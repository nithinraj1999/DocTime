import { inject, injectable } from 'tsyringe'
import { IPatientServices } from '../../interfaces/IPatientServices'
import { Patient } from '@prisma/client'
import { IPatientRepository, ICreatePatientDTO } from '../../interfaces/IPatiantRepository'

@injectable()
export class PatientService implements IPatientServices {
    constructor(
        @inject('IPatientRepository')
        private patientRepository: IPatientRepository
    ) {}

    async createPatient(data: ICreatePatientDTO): Promise<Patient> {
        return (await this.patientRepository.create(data)) as Patient
    }

    async updatePatient(id: string, data: Partial<ICreatePatientDTO>): Promise<Patient> {
        const existingPatient = await this.patientRepository.findById(id)
        if (!existingPatient) throw new Error('Patient not found')

        return (await this.patientRepository.update(id, data)) as Patient
    }

    async getPatientById(id: string): Promise<Patient | null> {
        return (await this.patientRepository.findById(id)) as Patient | null
    }

    async getPatientByUserId(userId: string): Promise<Patient[]>  {
        return (await this.patientRepository.findByUserId(userId)) as Patient[]
    }

    async getAllPatients(): Promise<Patient[]> {
        return (await this.patientRepository.getAllPatients()) as Patient[]
    }
}
