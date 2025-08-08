import { inject, injectable } from 'tsyringe'
import { IDoctorProfileServices } from '../../interfaces/IDoctorProfileServices'
import { IDoctor } from '../../entities/doctor'
import { IDoctorRepository } from '../../interfaces/IDoctorRepository'
export interface ICreateDoctorProfileDTO {
    userId: string
    fullName: string
    gender: string
    dateOfBirth: Date
    phoneNumber: string
    email: string
    profileImage: string
    bio: string
    languages: string[]
    specializations: string[]
    expertiseAreas: string[]
    education: any // JSON
    experience: any // JSON
    clinics: {
        clinicName: string
        address: string
        city: string
        state: string
        country: string
        postalCode: string
        phoneNumber: string
    }[]
    availability: {
        dayOfWeek: string
        startTime: string
        endTime: string
    }[]
    consultationFees: {
        mode: string
        fee: number
        currency: string
    }[]
}

@injectable()
export class DoctorProfileService implements IDoctorProfileServices {
    constructor(@inject('IDoctorRepository') private doctorRepository: IDoctorRepository) {}

    async createDoctorProfile(data: ICreateDoctorProfileDTO): Promise<IDoctor> {
        return this.doctorRepository.createProfile(data)
    }
    async updateProfile(id: string, data: Partial<ICreateDoctorProfileDTO>): Promise<IDoctor> {
        const existingDoctor = await this.doctorRepository.findById(id)
        if (!existingDoctor) throw new Error('Doctor not found')
        return this.doctorRepository.updateDoctor(id, data)
    }
}
