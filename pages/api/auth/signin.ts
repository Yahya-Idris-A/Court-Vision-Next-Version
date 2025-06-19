import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.post(
      `${process.env.SECRET_API_BASE_URL}/api/auth/login`,
      req.body
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Sign In Proxy Error", error);
    // Periksa apakah error ini berasal dari Axios dan memiliki objek respons
    if (axios.isAxiosError(error) && error.response) {
      // Cek apakah status errornya adalah 401 (Unauthorized)
      if (error.response.status === 401) {
        // Kirim respons kustom untuk error 401
        return res
          .status(401)
          .json({ message: "Akun tidak tersedia atau email/password salah." });
      }

      // Untuk error lain dari backend (misal: 500, 404), teruskan status dan datanya
      return res.status(error.response.status).json(error.response.data);
    } else {
      // Untuk error lain yang bukan dari axios (misal: masalah jaringan)
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan pada server proxy." });
    }
  }
}
