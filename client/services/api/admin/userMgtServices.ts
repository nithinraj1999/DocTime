import apiClient from "@/lib/apiClient";
export interface UserCreatePayload {
  name: string;
  email: string;
  password: string;
  role?: string; // optional role
}

export interface UserUpdatePayload {
  fullName?: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  profileImage: string | null;
  phoneNumber: string;
  isAdmin: boolean;
  status: 'ACTIVE' | 'BLOCKED';
  isVerified: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export async function createUser (payload: FormData) {
    const res = await apiClient.post(`/admin/user-mgt/user`, payload,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  }

  export async function updateUser (id: string, payload: FormData) {
    const res = await apiClient.put(`/admin/user-mgt/user/${id}`, payload,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  }

 export async function blockUser (id: string) {
    const res = await apiClient.patch(`/admin/user-mgt/user/${id}/block`);
    return res.data;
  }

  export async function unblockUser (id: string) {
    const res = await apiClient.patch(`/admin/user-mgt/user/${id}/unblock`);
    return res.data;
  }

export async function getAllUsers (){
    const res = await apiClient.get(`/admin/user-mgt/users`);
    return res.data;
  }

