export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "other";
  bloodGroup: string;
  createdAt: Date;
  updatedAt: Date;
}
 