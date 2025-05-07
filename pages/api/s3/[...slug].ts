import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;
  const path = slug instanceof Array ? slug.join("/") : slug;
  const url = `${process.env.SECRET_API_BASE_URL}/api/s3/${path}`;
  console.log("Proxy URL ", url);
  console.log("Req Query ", req.query);

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
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ message: error.message });
  }
}
