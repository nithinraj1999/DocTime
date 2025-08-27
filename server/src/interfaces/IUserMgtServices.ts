import { IUser } from "../entities/user";

export interface IUserMgtService {
    createNewUser(userData: Partial<IUser>,file:any): Promise<Partial<IUser>|null>
    updateUser(id: string, userData: Partial<IUser>,file:any): Promise<Partial<IUser>>;
    blockUser(id: string): Promise<Partial<IUser>>;
    unblockUser(id: string): Promise<Partial<IUser>>;
    getAllUsers(search:string, page:number, limit:number): Promise<{ totalUsers: number; allUsers: IUser[] }>
}