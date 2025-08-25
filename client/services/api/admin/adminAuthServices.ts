import axios from "axios";
import apiClient from "@/lib/apiClient";


export async function signin(data: Record<string, any>) {
  try {
    const res = await apiClient.post('/admin/auth/login', data);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
}


export async function logoutAdmin() {
  try {
    const res = await apiClient.post('/admin/auth/logout');
    return res;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to logout");
  }
}