import apiClient from "@/lib/apiClient";
import { IUser } from "@/store/userDetailStore"; 

export async function getProfile(id: string){
  try {
    const res = await apiClient.get(`/profile/${id}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch profile");
  }
}

export async function updateProfile(id: string, data: Partial<IUser>) {
  try {
    const res = await apiClient.put(`/profile/${id}`, data);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update profile");
  }
}
