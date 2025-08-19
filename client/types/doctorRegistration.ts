export interface DoctorProfileForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  phoneNumber: string;
  profileImage?: string;
  bio?: string;
  languages: string[];
  specializations: string[];
  expertiseAreas: string[];
  education: {
    degree: string;
    university: string;
    year: string;
  };
  experience: {
    hospitals: Array<{
      name: string;
      years: string;
    }>;
  };
  clinics: Array<{
    clinicName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phoneNumber: string;
  }>;
  availability: Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }>;
  consultationFees: Array<{
    mode: string;
    fee: number;
    currency: string;
  }>;
}
