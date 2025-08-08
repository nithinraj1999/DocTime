import axios from "axios";

export async function signup(data: Record<string, any>) {
  try {
    const res = await axios.post('/api/auth/signup', data);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
}
