export interface IDoctor {
  id: string;
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

  education: any;   
  experience: any;  

  createdAt: Date;
  updatedAt: Date;
}
