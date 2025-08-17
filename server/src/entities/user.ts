import { Patient } from "./patiant"

export interface IUser {
    id: string
    name: string
    email: string
    password: string
    profileImage: string | null
    phoneNumber: string
    isAdmin: boolean
    status: 'ACTIVE' | 'BLOCKED'
    isVerified: boolean
    patient?: Patient
    createdAt: Date
    updatedAt: Date
}
