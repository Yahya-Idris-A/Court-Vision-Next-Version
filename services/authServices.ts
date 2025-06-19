import axiosIns from "../lib/axios";

// Tambahkan type untuk data login dan register jika tersedia
interface AuthPayload {
  email: string;
  password: string;
  [key: string]: any;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  photo_url: string;
}

// login
export const signin = (data: AuthPayload) => {
  return axiosIns.post("/api/auth/signin", data);
};

// registrasi
export const signup = (data: AuthPayload) => {
  return axiosIns.post("/api/auth/signup", data);
};

// get user profile
export const getUser = async (): Promise<UserData | null> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return null;

  axiosIns.defaults.headers.common["Content-Type"] = "application/json";
  axiosIns.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  try {
    const res = await axiosIns.get("/api/users/profile");
    return res.data.user;
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
};
