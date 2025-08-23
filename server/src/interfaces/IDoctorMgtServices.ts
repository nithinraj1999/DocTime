import { ICreateDoctorProfileDTO } from "./IDoctorProfileServices"
import { IDoctor } from "../entities/doctor"

export interface IDoctorMgtService {
    createDoctor(data: ICreateDoctorProfileDTO,file: Express.Multer.File|null): Promise<IDoctor>
    updateDoctor(id: string, data: Partial<ICreateDoctorProfileDTO>, file?: Express.Multer.File): Promise<IDoctor>
    // blockDoctor(id: string): Promise<IDoctor>
    // unblockDoctor(id: string): Promise<IDoctor>
    getAllDoctors(): Promise<IDoctor[]>
    getDoctorById(id: string): Promise<IDoctor | null>
    getDoctorByEmail(email: string): Promise<IDoctor | null>
}
