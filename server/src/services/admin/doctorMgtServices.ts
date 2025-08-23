import { inject, injectable } from 'tsyringe'
import { IDoctorRepository } from '../../interfaces/IDoctorRepository'
import { IDoctorMgtService } from '../../interfaces/IDoctorMgtServices'
import { ICreateDoctorProfileDTO } from '../doctor/profileServices'
import bcrypt from 'bcrypt'
import { IDoctor } from '../../entities/doctor'
import { S3Bucket } from '../../config/awsS3'
@injectable()
export class DoctorMgtService implements IDoctorMgtService {
    constructor(@inject('IDoctorRepository') private doctorRepo: IDoctorRepository) {}

    async createDoctor(data: ICreateDoctorProfileDTO, file: Express.Multer.File |null): Promise<IDoctor> {
        if (!data.email || !data.password || !data.fullName) {
            throw new Error('Full name, email, and password are required')
        }

        const existingDoctor = await this.doctorRepo.findByEmail(data.email)
        if (existingDoctor) {
            throw new Error('Doctor with this email already exists')
        }
        let profileImageUrl =null
        if (file) {
            const s3 = new S3Bucket()
             profileImageUrl = await s3.uploadProfilePic(file.originalname, file.buffer, file.mimetype, 'profile-pics')
           
        } else {
        }
        if(!profileImageUrl){
            throw new Error('Profile image upload failed')
        }
        const newDoctor = await this.doctorRepo.createProfile(data,profileImageUrl)
        return newDoctor
    }

    async updateDoctor(id: string, data: Partial<ICreateDoctorProfileDTO>,file: Express.Multer.File): Promise<IDoctor> {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10)
        }
        let profileImageUrl =null
        if (file) {
            const s3 = new S3Bucket()
             profileImageUrl = await s3.uploadProfilePic(file.originalname, file.buffer, file.mimetype, 'profile-pics')
           
        } else {
        }

        return this.doctorRepo.updateDoctor(id, data,profileImageUrl)
    }

    // async blockDoctor(id: string): Promise<IDoctor> {
    //     return this.doctorRepo.updateDoctor(id, { status: 'BLOCKED' } as any)
    // }

    // async unblockDoctor(id: string): Promise<IDoctor> {
    //     return this.doctorRepo.updateDoctor(id, { status: 'ACTIVE' } as any)
    // }

    async getAllDoctors(): Promise<IDoctor[]> {
        return this.doctorRepo.getAllDoctors()
    }

    async getDoctorById(id: string): Promise<IDoctor | null> {
        return this.doctorRepo.findById(id) as unknown as IDoctor | null
    }

    async getDoctorByEmail(email: string): Promise<IDoctor | null> {
        return this.doctorRepo.findByEmail(email)
    }
}
