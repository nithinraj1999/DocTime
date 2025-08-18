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