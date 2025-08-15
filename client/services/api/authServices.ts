import axios from "axios";
import apiClient from "@/lib/apiClient";
export async function signup(data: Record<string, any>) {
  try {
    const res = await axios.post('/api/auth/signup', data);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
}


export async function verifyOtp(data: Record<string, string>) {
  try {
    const res = await axios.post('/api/auth/verify-otp', data);
    return res.data;
  } catch (error: any) {
    throw new Error(error);
  }
}



export async function resendOtp(data: Record<string, string>) {
  try {
    const res = await axios.post('/api/auth/resend-otp', data);
    return res.data;
  } catch (error: any) {
    throw new Error(error);
  }
}



export async function login(data:{email:string,password:string}) {
  try {
    const res = await apiClient.post('/auth/login',data);
    console.log(res);
    
    return res.data;
  } catch (error: any) {
    console.log(error);
    
    throw new Error(error);
  }
} 
  