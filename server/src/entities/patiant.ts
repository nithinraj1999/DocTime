export type Gender = "MALE" | "FEMALE" | "OTHER";

export type BloodGroup =
  | "A_POS"
  | "A_NEG"
  | "B_POS"
  | "B_NEG"
  | "AB_POS"
  | "AB_NEG"
  | "O_POS"
  | "O_NEG";

export interface Patient {
  id: string;
  userId: string;
  dateOfBirth: Date;
  name: string;
  gender: Gender;
  bloodGroup?: BloodGroup | null;
  address?: string | null;
  phoneNumber?: string | null;
  emergencyContact?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
