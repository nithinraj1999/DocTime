import apiClient from "@/lib/apiClient";

export async function registerDoctor(data: Record<string, any>) {
  try {
    const res = await apiClient.post("/doctor/profile", data);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create doctor"
    );
  }
}
