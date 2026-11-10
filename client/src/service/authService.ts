import axios from "axios";



const API_URL ="http://localhost:8080"

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type AuthResponse = {
  message: string;
  user: AuthUser;
  token: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};



export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> =>{
  const response  = await  axios.post(`${API_URL}/api/auth/register`, payload);
  localStorage.setItem("user", JSON.stringify(response.data.user));
  localStorage.setItem("token", response.data.token);
  return response.data
}
  



export const loginUser = async (payload: LoginPayload) : Promise<AuthResponse> =>{
    const response = await axios.post(`${API_URL}/api/auth/login`, payload);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("token", response.data.token);
    return response.data
   
}