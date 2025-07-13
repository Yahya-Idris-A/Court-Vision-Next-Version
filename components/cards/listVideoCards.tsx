"use client";
import React from "react";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { callToaster } from "@/lib/toaster";

interface AnalysisCardProps {
  thumbnail: string;
  title: string;
  date: string;
  venue: string;
  uploadProgress: number | null;
  uploadStatus: string;
  detailAnalysisUrl: string;
}

export default function AnalysisCard({
  thumbnail,
  title,
  date,
  venue,
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

  function goToDetailAnalysis(url: string) {
    if (uploadStatus != "completed") {
      callToaster("error", "Analysis is not completed or failed.");
      return;
    } else {
      window.location.href = url;
    }
  }

  return (
    <div
      onClick={() => goToDetailAnalysis(detailAnalysisUrl)}
      className="flex flex-row max-sm:flex-col gap-[20px] px-[8px] py-[10px] w-full rounded-[10px] bg-[var(--CardBackground)] border border-[var(--Border)] shadow cursor-pointer"
    >
      <div className="flex max-w-[250px] max-sm:max-w-full w-full">
        <Image
          src={thumbnail}
          alt={thumbnail}
          width={250}
          height={120}
          priority
          className="object-cover w-[250px] max-sm:w-full h-[120px] max-sm:h-full"
        />
      </div>
      <div className="flex flex-col w-full gap-[5px] justify-center">
        <div className="flex flex-col w-full gap-[5px]">
          <div className="flex flex-row justify-between gap-[10px] items-end">
            <div className="flex flex-col w-full gap-[1px]">
              <h2 className="text-[var(--MainText)] text-[20px] font-semibold">
                {title}
              </h2>
              <p className="text-[15px] text-[var(--TextSecondary)] font-semibold">
                {date} at {venue}
              </p>
            </div>
            {uploadStatus === "waiting" && (
              <p className="text-[15px] text-[var(--MainText)] font-semibold">
                0%
              </p>
            )}
            {uploadStatus === "processing" && (
              <p className="text-[15px] text-[var(--MainText)] font-semibold">
                {uploadProgress}%
              </p>
            )}
            {uploadStatus === "completed" && (
              <p className="text-[15px] text-[var(--MainText)] font-semibold">
                100%
              </p>
            )}
            {uploadStatus === "failed" && (
              <p className="text-[15px] text-[var(--MainText)] font-semibold">
                0%
              </p>
            )}
          </div>
          {/* Progress Bar */}
          {uploadStatus === "waiting" ? (
            // Indeterminate progress bar (animated)
            <div className="overflow-hidden rounded-[10px] border-[1px] border-[var(--SidebarActive)] h-[20px] relative bg-[var(--SidebarActive)]">
              <div className="absolute top-0 left-0 h-full w-1/3 bg-[var(--MainButton)] animate-pulse-indeterminate"></div>
            </div>
          ) : uploadStatus === "processing" && uploadProgress !== null ? (
            <div className="overflow-hidden rounded-[10px] border-[1px] border-[var(--SidebarActive)] bg-[var(--SidebarActive)] h-[20px]">
              <div
                className="h-full bg-[var(--MainButton)] transition-all duration-500 ease-in-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          ) : uploadStatus === "processing" && uploadProgress === null ? (
            // Indeterminate progress bar (animated)
            <div className="overflow-hidden rounded-[10px] border-[1px] border-[var(--SidebarActive)] h-[20px] relative bg-[var(--SidebarActive)]">
              <div className="absolute top-0 left-0 h-full w-1/3 bg-[var(--MainButton)] animate-pulse-indeterminate"></div>
            </div>
          ) : uploadStatus === "completed" ? (
            <div className="overflow-hidden rounded-[10px] border-[1px] border-[var(--SidebarActive)] bg-[var(--SidebarActive)] h-[20px]">
              <div
                className="h-full bg-[var(--MainButton)] transition-all duration-500 ease-in-out"
                style={{ width: `100%` }}
              ></div>
            </div>
          ) : uploadStatus === "failed" ? (
            <div className="overflow-hidden rounded-[10px] border-[1px] border-[var(--SidebarActive)] bg-[var(--SidebarActive)] h-[20px]">
              <div
                className="h-full bg-[var(--MainButton)] transition-all duration-500 ease-in-out"
                style={{ width: `0%` }}
              ></div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-row justify-start gap-[5px] items-center">
          {uploadStatus == "waiting" || uploadStatus == "processing" ? (
            <>
              <Loader2 className="w-[22px] h-[22px] text-[var(--MainButton)] animate-spin" />
              <p className="text-[15px] text-[var(--MainText)] font-normal">
                {loadingText}
              </p>
            </>
          ) : uploadStatus === "completed" ? (
            <>
              <CheckCircle className="w-[22px] h-[22px] text-[var(--MainButton)]" />
              <p className="text-[15px] text-[var(--MainText)] font-normal">
                Completed
              </p>
            </>
          ) : (
            <>
              <XCircle className="w-[22px] h-[22px] text-[var(--Danger)]" />
              <p className="text-[15px] text-[var(--MainText)] font-normal">
                Failed
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
