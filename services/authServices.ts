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
}

interface UserResponse {
  data: {
    user: UserData;
  };
}

// login
export const signin = (data: AuthPayload) => {
  return axiosIns.post("/signin", data);
};

// registrasi
export const signup = (data: AuthPayload) => {
  return axiosIns.post("/signup", data);
};

// get user profile
export const getUser = async (): Promise<UserData | null> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return null;

  try {
    const res = await fetch("/api/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Gagal mengambil user");
    }

    const json: UserResponse = await res.json();
    return json.data.user;
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
};
