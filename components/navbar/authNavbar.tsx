"use client";
import React from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import * as authService from "@/services/authServices";

interface UserData {
  id: number;
  name: string;
  email: string;
  photo_url: string;
}

export default function AuthNavbar() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  const getUserData = async () => {
    setIsLoadingUserData(true); // Mulai loading
    try {
      const data = await authService.getUser();
      setUserData(data);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
    } finally {
      setIsLoadingUserData(false); // Selesai loading
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="flex flex-row items-center justify-end max-sm:justify-center bg-[var(--CardBackground)] border border-[var(--Border)] shadow gap-[8px] w-full rounded-[6px]">
      {isLoadingUserData ? (
        // Skeleton Loader
        <div
          className="w-[50px] h-[50px] rounded-full bg-gray-300 animate-pulse"
          aria-label="Memuat gambar profil..." // Untuk aksesibilitas
        ></div>
      ) : (
        <Image
          width={50}
          height={50}
          src={userData?.photo_url || "/user/user.svg"}
          alt="Foto Profil"
          priority
          className="size-[50px] my-[6px] rounded-full object-cover"
          // Opsional: Tambahkan key untuk memaksa re-render jika src berubah dari/ke default
          key={userData?.photo_url || "/user/user.svg"}
        />
      )}
      <p className="text-[15px] text-[var(--MainText)] font-normal ml-[8px] mr-[32px] max-sm:mr-0">
        {userData?.name || "Loading..."}
      </p>
    </div>
  );
}
