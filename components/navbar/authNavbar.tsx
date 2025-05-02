import React from "react";
import Image from "next/image";

// Simulasi props atau state userData. Nanti bisa diganti pakai context/auth hooks
type Props = {
  userData: {
    user?: {
      name?: string;
    };
  };
};

const AuthNavbar: React.FC<Props> = ({ userData }) => {
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
        {userData.user?.name || "Loading..."}
      </p>
    </div>
  );
};

export default AuthNavbar;
