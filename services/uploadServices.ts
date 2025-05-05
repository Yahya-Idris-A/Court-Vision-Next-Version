import axiosUpload from "@/lib/uploadProxy";

export const setHeaders = () => {
  axiosUpload.defaults.headers.common["Content-Type"] = "application/json";
  axiosUpload.defaults.headers.common["Authorization"] = `Bearer ${
    localStorage.getItem("token")?.replace(/['"]+/g, "") || ""
  }`;
};

export async function getSignedUrl(
  filename: string,
  contentType: string,
  signal?: AbortSignal
) {
  const res = await axiosUpload.post(
    "/api/s3/sign",
    { filename, contentType },
    { signal }
  );
  return res;
}

export async function createMultipartUpload(
  filename: string,
  contentType: string,
  metadata: any
) {
  const res = await axiosUpload.post("/api/s3/multipart", {
    filename,
    contentType,
    metadata,
  });
  return res.data;
}

export async function signPart(
  uploadId: string,
  key: string,
  partNumber: number,
  signal?: AbortSignal
) {
  const filename = encodeURIComponent(key);
  const res = await axiosUpload.get(
    `/api/s3/multipart/${uploadId}/${partNumber}?key=${filename}`,
    {
      signal,
    }
  );
  return res.data;
}

export async function listParts(
  uploadId: string,
  key: string,
  signal?: AbortSignal
) {
  const filename = encodeURIComponent(key);
  const res = await axiosUpload.get(
    `/api/s3/multipart/${uploadId}?key=${filename}`,
    {
      signal,
    }
  );
  return res.data;
}

export async function completeMultipartUpload(
  uploadId: string,
  key: string,
  parts: any[],
  signal?: AbortSignal
) {
  const filename = encodeURIComponent(key);
  const uploadIdEnc = encodeURIComponent(uploadId);
  const res = await axiosUpload.post(
    `/api/s3/multipart/${uploadIdEnc}/complete?key=${filename}`,
    { parts },
    { signal }
  );
  return res.data;
}

export async function abortMultipartUpload(
  uploadId: string,
  key: string,
  signal?: AbortSignal
) {
  const filename = encodeURIComponent(key);
  const uploadIdEnc = encodeURIComponent(uploadId);
  const res = await axiosUpload.delete(
    `/api/s3/multipart/${uploadIdEnc}?key=${filename}`,
    {
      signal,
    }
  );
  return res.data;
}
