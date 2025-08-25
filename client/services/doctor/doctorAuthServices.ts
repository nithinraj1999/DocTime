import apiClient from "@/lib/apiClient";

export async function doctorLogin(data: Record<string, any>) {
  try {
    const res = await apiClient.post("/doctor/auth/login", data);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create doctor"
    );
  }
}



export async function verifyOtp(data: Record<string, string>) {
  try {
    const res = await apiClient.post('/doctor/auth/verify-otp', data);
    return res.data;
  } catch (error: any) {
    throw new Error(error);
  }
}



export async function resendOtp(data: Record<string, string>) {
  try {
    const res = await apiClient.post('/doctor/auth/resend-otp', data);
    return res.data;
  } catch (error: any) {
    throw new Error(error);
  }
}



export async function logoutDoctor() {
  try {
    const res = await apiClient.post('/doctor/auth/logout');
    return res;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to logout");
  }
}



export async function forgotPassword(data: Record<string, string>) {
  try {
    const res = await apiClient.post('/doctor/auth/forgot-password', data);
    return res;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to send forgot password email");
  }
}

export async function resetPassword(data: Record<string, string>) {
  try {
    const res = await apiClient.post('/doctor/auth/reset-password', data);
    return res;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to send reset password email");
  }
}
