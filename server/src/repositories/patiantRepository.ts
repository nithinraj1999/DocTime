import { injectable } from 'tsyringe'
import { PrismaClient } from '@prisma/client'
import { Patient } from '../entities/patiant'
import { IPatientRepository, ICreatePatientDTO } from '../interfaces/IPatiantRepository'

@injectable()
export class PatientRepository implements IPatientRepository {
    private readonly prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    async create(data: ICreatePatientDTO): Promise<Partial<Patient>> {
        const newPatient = await this.prisma.patient.create({
            data: {
                userId: data.userId,
                dateOfBirth: data.dateOfBirth,
                name: data.name,
                gender: data.gender as any,
                bloodGroup: data.bloodGroup as any,
                ...(data.address && { address: data.address }),
                ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
                ...(data.emergencyContact && { emergencyContact: data.emergencyContact })
            }
        })

        return newPatient
    }

    async findById(id: string): Promise<Partial<Patient> | null> {
        return this.prisma.patient.findUnique({
            where: { id },
            include: { user: true }
        })
    }

    async findByUserId(userId: string): Promise<Patient[]> {
        return this.prisma.patient.findMany({
            where: { userId },
            include: { user: true }
        })
    }

    async update(id: string, data: Partial<Patient>): Promise<Partial<Patient>> {
        return this.prisma.patient.update({
            where: { id },
            data
        })
    }

    async getAllPatients(): Promise<Patient[]> {
        return this.prisma.patient.findMany({
            include: { user: true }
        })
    }
}
