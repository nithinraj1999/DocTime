export interface IDoctor {
  id: string;
  fullName: string;
  gender: string;
  password:string
  phoneNumber: string;
  email: string;
  profileImage: string;
  bio: string;

  languages: string[];
  specializations: string[];
  expertiseAreas: string[];

  education: any;   
  experience: any;  

  createdAt: Date;
  updatedAt: Date;
}
