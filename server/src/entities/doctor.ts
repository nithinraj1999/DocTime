export interface IDoctor {
  id: string;
  fullName: string;
  gender: string;
  password:string
  phoneNumber: string;
  email: string;
  profileImage: string;
  isVerified: boolean;
  bio: string;
  status: 'ACTIVE' | 'BLOCKED';
  languages: string[];
  specializations: string[];
  expertiseAreas: string[];

  education: any;   
  experience: any;  

  createdAt: Date;
  updatedAt: Date;
}
