import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL, // http://localhost:5000/api
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // if your backend uses cookies/session
});

export default apiClient;
