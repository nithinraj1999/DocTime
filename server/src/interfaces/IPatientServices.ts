import { Patient } from "../entities/patiant";
import { ICreatePatientDTO } from "./IPatiantRepository";

export interface IPatientServices {
  createPatient(data: ICreatePatientDTO): Promise<Patient>;
  updatePatient(id: string, data: Partial<ICreatePatientDTO>): Promise<Patient>;
  getPatientById(id: string): Promise<Patient | null>;
  getPatientByUserId(userId: string): Promise<Patient[]> 
  getAllPatients(): Promise<Patient[]>;
}
