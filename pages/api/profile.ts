import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", req.headers.authorization);

  if (!authHeader) {
    return res.status(401).json({ message: "Authentication token is missing" });
  }

  try {
    const backendRes = await axios.get(
      `${process.env.SECRET_API_BASE_URL}/api/profile`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );

    return res.status(200).json(backendRes.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Internal server error";

    return res.status(status).json({ message });
  }
}
