import { IUser } from "../entities/user";

export interface IUserMgtService {
    createNewUser(userData: Partial<IUser>): Promise<Partial<IUser>|null>
    updateUser(id: string, userData: Partial<IUser>): Promise<Partial<IUser>>;
    blockUser(id: string): Promise<Partial<IUser>>;
    unblockUser(id: string): Promise<Partial<IUser>>;
    getAllUsers(): Promise<Partial<IUser>[]>;
}