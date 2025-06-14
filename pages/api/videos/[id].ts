import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const url = `${process.env.SECRET_API_BASE_URL}/api/videos/${id}`;

  try {
    const response = await axios({
      method: req.method,
      url,
      headers: { Authorization: req.headers.authorization || "" },
      ...(req.method === "GET" || req.method === "DELETE"
        ? { params: req.query }
        : { params: req.query, data: req.body }),
    });

    res.status(response.status).json(response.data);
    console.log("response data: ", response.data);
  } catch (error) {
    console.log(error);
  }
}
