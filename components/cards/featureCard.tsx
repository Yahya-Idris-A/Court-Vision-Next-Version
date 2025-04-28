"use client";

import Image from "next/image";

type FeatureCardProps = {
  cover: string;
  heading: string;
  description: string;
};

export default function FeatureCard({
  cover,
  heading,
  description,
}: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center bg-white border border-[#DBDADE]  shadow  rounded-[16px] w-full">
      <Image
        src={cover}
        alt={heading}
        width={400} // default width, bisa diubah
        height={400} // default height, bisa diubah
        sizes="(max-width: 768px) 100vw, 400px"
        style={{ width: "100%", height: "auto" }}
        className="px-[32px] pt-[32px] max-sm:px-[12px] max-sm:pt-[12px] max-xl:px-[20px] max-xl:pt-[20px]"
      />
      <h3 className="text-[24px] font-semibold text-[#667085] pt-[15px] max-sm:text-[12px] max-sm:pt-[6px] max-xl:text-[16px] max-xl:pt-[10px]">
        {heading}
      </h3>
      <p className="text-[13px] font-semibold text-[#667085] pb-[15px] max-sm:text-[6px] max-sm:pb-[6px] max-xl:text-[10px] max-xl:pb-[10px]">
        {description}
      </p>
    </div>
  );
}
