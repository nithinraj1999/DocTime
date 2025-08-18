import apiClient from "@/lib/apiClient";

export async function createPatient(data: Record<string, any>) {
  try {
    const res = await apiClient.post("/patients/patients", data);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create patient"
    );
  }
}

export async function updatePatient(id: string, data: Record<string, any>) {
  try {
    const res = await apiClient.put(`/patients/patients/${id}`, data);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update patient"
    );
  }
}

export async function getPatientById(id: string) {
  try {
    const res = await apiClient.get(`/patients/patients/${id}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch patient");
  }
}

export async function getPatientsByUserId(userId: string) {
  try {
    const res = await apiClient.get(`/patients/patients/user/${userId}`);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch patients"
    );
  }
}

// export async function deletePatient(id: string) {
//   try {
//     const res = await apiClient.delete(`/patients/patients/${id}`);
//     return res.data;
//   } catch (error: any) {
//     throw new Error(
//       error.response?.data?.message || "Failed to delete patient"
//     );
//   }
// }
