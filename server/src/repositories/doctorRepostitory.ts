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

import { PrismaClient,Prisma  } from '@prisma/client'
import { injectable } from 'tsyringe'
import { IDoctor } from '../entities/doctor'
import { IDoctorRepository } from '../interfaces/IDoctorRepository'
@injectable()
export class DoctorRepository implements IDoctorRepository {
    private readonly prisma = new PrismaClient()

    async createProfile(data: ICreateDoctorProfileDTO): Promise<IDoctor> {
        const doctor = await this.prisma.doctor.create({
            data: {
                userId: data.userId,
                fullName: data.fullName,
                gender: data.gender,
                dateOfBirth: data.dateOfBirth,
                phoneNumber: data.phoneNumber,
                email: data.email,
                profileImage: data.profileImage,
                bio: data.bio,
                languages: data.languages,
                specializations: data.specializations,
                expertiseAreas: data.expertiseAreas,
                education: data.education,
                experience: data.experience,
                clinics: {
                    create: data.clinics
                },
                availability: {
                    create: data.availability
                },
                consultationFees: {
                    create: data.consultationFees
                }
            }
        })

        return doctor
    }
    async findById(id: string): Promise<{ id: string } | null> {
        return this.prisma.doctor.findUnique({
            where: { id },
            select: {
                id: true
            }
        })
    }

    async updateDoctor(
        id: string,
        data: Partial<ICreateDoctorProfileDTO>
    ): Promise<IDoctor> {
        const updateData: Prisma.DoctorUpdateInput = {}

        // Simple scalar fields
        if (data.fullName !== undefined) updateData.fullName = data.fullName
        if (data.gender !== undefined) updateData.gender = data.gender
        if (data.dateOfBirth !== undefined) updateData.dateOfBirth = data.dateOfBirth
        if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber
        if (data.email !== undefined) updateData.email = data.email
        if (data.profileImage !== undefined) updateData.profileImage = data.profileImage
        if (data.bio !== undefined) updateData.bio = data.bio
        if (data.languages !== undefined) updateData.languages = data.languages
        if (data.specializations !== undefined) updateData.specializations = data.specializations
        if (data.expertiseAreas !== undefined) updateData.expertiseAreas = data.expertiseAreas
        if (data.education !== undefined) updateData.education = data.education
        if (data.experience !== undefined) updateData.experience = data.experience

        if (data.clinics !== undefined) {
            updateData.clinics = {
                deleteMany: {},
                create: data.clinics
            }
        }
        if (data.availability !== undefined) {
            updateData.availability = {
                deleteMany: {},
                create: data.availability
            }
        }
        if (data.consultationFees !== undefined) {
            updateData.consultationFees = {
                deleteMany: {},
                create: data.consultationFees
            }
        }

        return this.prisma.doctor.update({
            where: { id },
            data: updateData
        })
    }
}
