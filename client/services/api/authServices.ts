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
  

export async function logoutUser() {
  try {
    const res = await apiClient.post('/auth/logout');
    return res;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to logout");
  }
}


export async function forgetPassword(data: {email: string}) {
  try {
    const res = await apiClient.post('/auth/forgot-password', data);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to send reset link");
  }
}

export async function resetPassword(data: {email: string |null,newPassword:string,confirmPassword:string}) {
  try {
    const res = await apiClient.post('/auth/reset-password', data);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to send reset link");
  }
}