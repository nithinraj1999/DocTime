import { IDoctor } from "../entities/doctor";
export interface ICreateDoctorProfileDTO {
  userId: string;
  fullName: string;
  gender: string;
  dateOfBirth: Date;
  phoneNumber: string;
  email: string;
  profileImage: string;
  bio: string;
  languages: string[];
  specializations: string[];
  expertiseAreas: string[];
  education: any; // JSON
  experience: any; // JSON
  clinics: {
    clinicName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phoneNumber: string;
  }[];
  availability: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }[];
  consultationFees: {
    mode: string;
    fee: number;
    currency: string;
  }[];
}

export interface IDoctorProfileServices {
  createDoctorProfile(data:ICreateDoctorProfileDTO): Promise<IDoctor>;
  updateProfile(id: string, data: Partial<ICreateDoctorProfileDTO>): Promise<IDoctor> 
}
