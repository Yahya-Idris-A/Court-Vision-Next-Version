"use client";
import React from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import * as authService from "@/services/authServices";

interface UserData {
  id: number;
  name: string;
  email: string;
}

export default function AuthNavbar() {
  const [userData, setUserData] = useState<UserData | null>(null);

  const getUserData = async () => {
    const data = await authService.getUser();
    setUserData(data);
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="flex flex-row items-center justify-end max-sm:justify-center bg-white shadow gap-[8px] w-full rounded-[6px] stroke-[#667085]">
      <Image
        src="/user/Avatar.png"
        alt="User Avatar"
        width={50}
        height={50}
        className="size-[50px] my-[6px]"
      />
      <p className="text-[15px] text-[#4B465C] font-normal ml-[8px] mr-[32px] max-sm:mr-0">
        {userData?.name || "Loading..."}
      </p>
    </div>
  );
}
