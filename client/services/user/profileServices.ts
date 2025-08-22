import apiClient from "@/lib/apiClient";

export async function getProfile(id: string){
  try {
    const res = await apiClient.get(`/profile/${id}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch profile");
  }
}

export async function updateProfile(id: string, data: FormData) {
  try {
    const res = await apiClient.put(`/profile/${id}`, data,{
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update profile");
  }
}
