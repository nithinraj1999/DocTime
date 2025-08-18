export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

export enum BloodGroup {
  A_POS = "A_POS",
  A_NEG = "A_NEG",
  B_POS = "B_POS",
  B_NEG = "B_NEG",
  AB_POS = "AB_POS",
  AB_NEG = "AB_NEG",
  O_POS = "O_POS",
  O_NEG = "O_NEG"
}

export interface Patient {
  id: string;
  name: string;
  userId: string;
  dateOfBirth: Date; // ISO date string
  gender: Gender;
  bloodGroup?: BloodGroup;
  address?: string;
  phoneNumber?: string;
  emergencyContact?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface PatientFormData {
  name: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup?: BloodGroup;
  address?: string;
  phoneNumber?: string;
  emergencyContact?: string;
}



export interface IDoctor {
  id: string;
  fullName: string;
  password: string;
  confirmPassword?: string;
  gender: string;
  phoneNumber: string;
  email: string;
  profileImage: string;
  bio: string;
  isVerified: boolean;
  status: 'ACTIVE' | 'BLOCKED';
  languages: string[];
  specializations: string[];
  expertiseAreas: string[];
  education: {
    degree: string;
    university: string;
    year: number;
  };
  experience: {
    hospitals: {
      name: string;
      years: string;
    }[];
  };
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
  createdAt: Date;
  updatedAt: Date;
}

