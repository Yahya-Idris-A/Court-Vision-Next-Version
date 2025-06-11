"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface AnalysisCardProps {
  thumbnail: string;
  title: string;
  date: string;
  uploadProgress: number | null;
  uploadStatus: string;
  detailAnalysisUrl: string;
}

export default function AnalysisCard({
  thumbnail,
  title,
  date,
  uploadProgress,
  uploadStatus,
  detailAnalysisUrl,
}: AnalysisCardProps) {
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const loadingText = `${uploadStatus}${".".repeat(loadingStep)}`;

  return (
    <Link
      href={detailAnalysisUrl}
      className="flex flex-row max-sm:flex-col gap-[20px] px-[8px] py-[10px] w-full rounded-[10px] bg-white stroke-[#667085] shadow cursor-pointer"
    >
      <div className="flex max-w-[250px] max-sm:max-w-full w-full">
        <Image
          src={thumbnail}
          alt={thumbnail}
          width={250}
          height={120}
          className="object-cover w-[250px] max-sm:w-full h-[120px] max-sm:h-full"
        />
      </div>
      <div className="flex flex-col w-full gap-[5px] justify-center">
        <div className="flex flex-col w-full gap-[5px]">
          <div className="flex flex-row justify-between gap-[10px] items-end">
            <div className="flex flex-col w-full gap-[1px]">
              <h2 className="text-black text-[20px] font-semibold">{title}</h2>
              <p className="text-[15px] text-[#ADADAD] font-semibold">{date}</p>
            </div>
            {uploadStatus === "waiting" && (
              <p className="text-[15px] text-black font-semibold">0%</p>
            )}
            {uploadStatus === "processing" && (
              <p className="text-[15px] text-black font-semibold">
                {uploadProgress}%
              </p>
            )}
            {uploadStatus === "completed" && (
              <p className="text-[15px] text-black font-semibold">100%</p>
            )}
            {uploadStatus === "failed" && (
              <p className="text-[15px] text-black font-semibold">0%</p>
            )}
          </div>
          {/* Progress Bar */}
          {uploadStatus === "waiting" ? (
            // Indeterminate progress bar (animated)
            <div className="overflow-hidden rounded-[10px] border-[1px] border-[#403D91] h-[20px] relative bg-white">
              <div className="absolute top-0 left-0 h-full w-1/3 bg-[#403D91] animate-pulse-indeterminate"></div>
            </div>
          ) : uploadStatus === "processing" && uploadProgress !== null ? (
            <div className="overflow-hidden rounded-[10px] border-[1px] border-[#403D91] h-[20px]">
              <div
                className="h-full bg-[#403D91] transition-all duration-500 ease-in-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          ) : uploadStatus === "processing" && uploadProgress === null ? (
            // Indeterminate progress bar (animated)
            <div className="overflow-hidden rounded-[10px] border-[1px] border-[#403D91] h-[20px] relative bg-white">
              <div className="absolute top-0 left-0 h-full w-1/3 bg-[#403D91] animate-pulse-indeterminate"></div>
            </div>
          ) : uploadStatus === "completed" ? (
            <div className="overflow-hidden rounded-[10px] border-[1px] border-[#403D91] h-[20px]">
              <div
                className="h-full bg-[#403D91] transition-all duration-500 ease-in-out"
                style={{ width: `100%` }}
              ></div>
            </div>
          ) : uploadStatus === "failed" ? (
            <div className="overflow-hidden rounded-[10px] border-[1px] border-[#403D91] h-[20px]">
              <div
                className="h-full bg-[#403D91] transition-all duration-500 ease-in-out"
                style={{ width: `0%` }}
              ></div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-row justify-start gap-[5px] items-center">
          {uploadStatus == "waiting" || uploadStatus == "processing" ? (
            <>
              <Loader2 className="w-[22px] h-[22px] text-[#FD6A2A] animate-spin" />
              <p className="text-[15px] text-black font-normal">
                {loadingText}
              </p>
            </>
          ) : uploadStatus === "completed" ? (
            <>
              <CheckCircle className="w-[22px] h-[22px] text-[#FD6A2A]" />
              <p className="text-[15px] text-black font-normal">Completed</p>
            </>
          ) : (
            <>
              <XCircle className="w-[22px] h-[22px] text-[#FD6A2A]" />
              <p className="text-[15px] text-black font-normal">Failed</p>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
