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
