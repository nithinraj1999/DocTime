import { IDoctor } from '../entities/doctor'
export interface ICreateDoctorProfileDTO {
    fullName: string
    gender: string
    password: string
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

export interface IDoctorRepository {
    createProfile(data: ICreateDoctorProfileDTO): Promise<IDoctor>
    findById(id: string): Promise<{ id: string } | null>
    findByEmail(email: string): Promise<IDoctor | null>
    updateDoctor(id: string, data: Partial<ICreateDoctorProfileDTO>): Promise<IDoctor>
}
