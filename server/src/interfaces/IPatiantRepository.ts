import { Patient } from "../entities/patiant";
import { BloodGroup } from "@prisma/client";
import { Gender } from "../entities/patiant";
export interface ICreatePatientDTO {
  userId: string;
  dateOfBirth: Date;
  name: string;
  gender: Gender;
  bloodGroup?: BloodGroup;
  address?: string;
  phoneNumber?: string;
  emergencyContact?: string;
}

export interface IPatientRepository {
  create(data: ICreatePatientDTO): Promise<Partial<Patient>>;
  findById(id: string): Promise<Partial<Patient> | null>;
  findByUserId(userId: string): Promise<Partial<Patient>[]> 
  update(id: string, data: Partial<Patient>): Promise<Partial<Patient>>;
  getAllPatients(): Promise<Patient[]>;
}
   