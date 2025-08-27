import apiClient from "@/lib/apiClient";
import { IDoctor } from "@/types/patients";

export async function createDoctor(payload: FormData) {
  const res = await apiClient.post(`/admin/doctor-mgt/doctor`, payload,{
    headers: {
      "Content-Type": "multipart/form-data"
    } 
  });
  return res.data;
}

export async function updateDoctor(id: string, payload: FormData) {
  const res = await apiClient.put(`/admin/doctor-mgt/doctor/${id}`, payload,{
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
}   

export async function blockDoctor(id: string) {
  const res = await apiClient.patch(`/admin/doctor-mgt/doctor/${id}/block`);
  return res.data;
}

export async function unblockDoctor(id: string) {
  const res = await apiClient.patch(`/admin/doctor-mgt/doctor/${id}/unblock`);
  return res.data;
}

export async function getAllDoctors(searchTerm:string|null, page:number, ITEMS_PER_PAGE:number) {
  console.log("search..search..", searchTerm);

  const res = await apiClient.get(`/admin/doctor-mgt/doctors`, {
    params: {
      search:searchTerm,
      page,
      limit:ITEMS_PER_PAGE
    }
  });
  return res.data;
}

export async function getDoctorById(id: string) {
  const res = await apiClient.get(`/admin/doctor-mgt/doctor/${id}`);
  return res.data;
}
