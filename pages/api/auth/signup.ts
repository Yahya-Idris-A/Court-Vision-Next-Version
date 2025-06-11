import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.post(
      `${process.env.SECRET_API_BASE_URL}/api/auth/register`,
      req.body
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Sign Up Proxy Error", error);
  }
}
