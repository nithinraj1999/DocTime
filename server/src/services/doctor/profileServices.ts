import { inject, injectable } from 'tsyringe'
import { IDoctorProfileServices } from '../../interfaces/IDoctorProfileServices'
import { IDoctor } from '../../entities/doctor'
import { IDoctorRepository } from '../../interfaces/IDoctorRepository'
import { IEmailService } from '../../config/nodeMailer'
import redis from '../../config/redis'
export interface ICreateDoctorProfileDTO {
    userId: string
    fullName: string
    password: string
    confirmPassword: string
    gender: string
    dateOfBirth: Date
    isVerified: boolean
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
    constructor(
        @inject('IDoctorRepository') private doctorRepository: IDoctorRepository,
        @inject('IEmailService') private emailService: IEmailService
    ) {}

    async createDoctorProfile(data: ICreateDoctorProfileDTO): Promise<IDoctor> {
        const { password, confirmPassword } = data
        if (password !== confirmPassword) throw new Error('Passwords do not match')
        const doctor = await this.doctorRepository.createProfile(data)
        const otp = await this.generateAndStoreOtp(data.email)

        await this.emailService.sendEmail(data.email, otp)

        return doctor
    }
    async updateProfile(id: string, data: Partial<ICreateDoctorProfileDTO>): Promise<IDoctor> {
        const existingDoctor = await this.doctorRepository.findById(id)
        if (!existingDoctor) throw new Error('Doctor not found')
        return this.doctorRepository.updateDoctor(id, data)
    }

    async generateAndStoreOtp(email: string): Promise<string> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        console.log('otp ---', otp)

        await redis.setex(`otp:${email}`, 300, otp)
        return otp
    }
}
