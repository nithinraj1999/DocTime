import apiClient from "@/lib/apiClient";
import { IDoctor } from "@/types/patients";

export async function registerDoctor(data: Record<string, any>) {
  try {
    
    const res = await apiClient.post("/doctor/profile", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create doctor"
    );
  }
}


export async function getDoctorProfile(id: string) {
  try {
    console.log("inside getDoctorProfile",id);

    const res = await apiClient.get(`/doctor/profile/${id}`);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch doctor profile"
    );
  }
}


export async function updateDoctorProfile(id: string, data: FormData) {
  try {

    const res = await apiClient.put(`/doctor/profile/${id}`, data,{
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update doctor profile"
    );
  } 
}
