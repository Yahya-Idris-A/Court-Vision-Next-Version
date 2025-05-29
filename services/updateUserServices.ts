import axiosIns from "../lib/axios";

// update user profile
export async function updateUserData(
  name: string,
  email: string,
  photo_url: string
) {
  const res = await axiosIns.put("/api/users/profile", {
    name,
    email,
    photo_url,
  });
  return res;
}
