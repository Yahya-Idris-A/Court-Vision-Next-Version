import axiosAnalyze from "@/lib/analyzeProxy";

export const setHeaders = () => {
  axiosAnalyze.defaults.headers.common["Content-Type"] = "application/json";
  axiosAnalyze.defaults.headers.common["Authorization"] = `Bearer ${
    localStorage.getItem("token")?.replace(/['"]+/g, "") || ""
  }`;
};

export const getToken = () => {
  return localStorage.getItem("token")?.replace(/['"]+/g, "") || "";
};

export const endPointUploadProgress =
  process.env.NEXT_PUBLIC_API_URL + "/api/videos/progress";

// get all video
export async function getAllVideos() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return null;

  axiosAnalyze.defaults.headers.common["Content-Type"] = "application/json";
  axiosAnalyze.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  try {
    const res = await axiosAnalyze.get("/api/videos");
    return res.data.videos;
  } catch (err) {
    console.error("Error fetching video:", err);
    return null;
  }
}

// get video analyzing progress
export async function getAllVideoProgress() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return null;

  axiosAnalyze.defaults.headers.common["Content-Type"] = "application/json";
  axiosAnalyze.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  try {
    const res = await axiosAnalyze.get("/api/videos/progress");
    return res.data;
  } catch (err) {
    console.error("Error fetching data:", err);
    return null;
  }
}
