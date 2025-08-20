// src/store/doctorRegistrationStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Education {
  degree: string;
  university: string;
  year: number;
}

interface ExperienceHospital {
  name: string;
  years: string;
}

interface Experience {
  hospitals: ExperienceHospital[];
}

interface Clinic {
  clinicName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
}

interface Availability {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface ConsultationFee {
  mode: string;
  fee: number;
  currency: string;
}

interface DoctorRegistration {
  fullName: string;
  password: string;
  confirmPassword: string;
  gender: string;
  phoneNumber: string;
  email: string;
  profileImage: string;
  bio: string;
  isVerified: boolean;
  languages: string[];
  specializations: string[];
  expertiseAreas: string[];
  education: Education;
  experience: Experience;
  clinics: Clinic[];
  availability: Availability[];
  consultationFees: ConsultationFee[];
}

interface DoctorRegistrationStore {
  doctorData: DoctorRegistration;
  setDoctorData: (data: Partial<DoctorRegistration>) => void;
  resetDoctorData: () => void;
}

export const useDoctorRegistrationStore = create<DoctorRegistrationStore>()(
  persist(
    (set) => ({
      doctorData: {
        fullName: "",
        password: "",
        confirmPassword: "",
        gender: "",
        phoneNumber: "",
        email: "",
        profileImage: "",
        bio: "",
        isVerified: false,
        languages: [],
        specializations: [],
        expertiseAreas: [],
        education: { degree: "", university: "", year: 0 },
        experience: { hospitals: [] },
        clinics: [],
        availability: [],
        consultationFees: [],
      },
      setDoctorData: (data) =>
        set((state) => ({
          
          doctorData: { ...state.doctorData, ...data },
        })),
      resetDoctorData: () =>
        set({
          doctorData: {
            fullName: "",
            password: "",
            confirmPassword: "",
            gender: "",
            phoneNumber: "",
            email: "",
            profileImage: "",
            bio: "",
            isVerified: false,
            languages: [],
            specializations: [],
            expertiseAreas: [],
            education: { degree: "", university: "", year: 0 },
            experience: { hospitals: [] },
            clinics: [],
            availability: [],
            consultationFees: [],
          },
        }),
    }),
    {
      name: "doctor-registration",
storage: createJSONStorage(() => sessionStorage)
    }
  )
);
