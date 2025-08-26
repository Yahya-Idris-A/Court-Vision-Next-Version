"use client";
import React from "react";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { callToaster } from "@/lib/toaster";
import ThumbnailPlaceholder from "./thumbnailPlaceholder";
import ModalConfirmDelete from "../partials/confirmDelete";
import * as analyzeServices from "@/services/analyzeService";

interface AnalysisCardProps {
  id: string;
  thumbnail: string;
  title: string;
  date: string;
  venue: string;
  uploadProgress: number | null;
  uploadStatus: string;
  detailAnalysisUrl: string;
  onUpdate: (videoId: string) => void;
}

export default function AnalysisCard({
  id,
  thumbnail,
  title,
  date,
  venue,
  uploadProgress,
  uploadStatus,
  detailAnalysisUrl,
  onUpdate,
}: AnalysisCardProps) {
  const [loadingStep, setLoadingStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const loadingText = `${uploadStatus}${".".repeat(loadingStep)}`;

  function goToDetailAnalysis(url: string) {
    if (uploadStatus === "completed") {
      window.location.href = url;
    } else if (uploadStatus === "failed") {
      callToaster("error", "Analysis is failed.");
      return;
    } else {
      callToaster("error", "Analysis is not completed yet.");
      return;
    }
  }

  const handleDelete = () => {
    try {
      analyzeServices.deleteVideo(id);
      onUpdate(id); // Call the update function to refresh the video list
    } catch (error) {
      callToaster("error", "Failed to delete video");
      console.error("Failed to delete video:", error);
    }
    setIsModalOpen(false);
  };

  return (
    <div
      onClick={() => goToDetailAnalysis(detailAnalysisUrl)}
      className="flex flex-row max-sm:flex-col gap-[20px] px-[8px] py-[10px] w-full rounded-[10px] bg-[var(--CardBackground)] border border-[var(--Border)] shadow cursor-pointer"
    >
      <div className="flex max-w-[250px] max-sm:max-w-full w-full">
        {uploadStatus === "completed" && thumbnail ? (
          <Image
            src={thumbnail}
            alt={thumbnail}
            key={thumbnail}
            width={250}
            height={120}
            priority
            className="object-cover w-[250px] max-sm:w-full h-[120px] max-sm:h-full"
          />
        ) : (
          <ThumbnailPlaceholder status={uploadStatus} />
        )}
      </div>
      <div className="flex flex-col w-full gap-[5px] justify-center">
        <div className="flex flex-col w-full gap-[5px]">
          <div className="flex flex-row justify-between gap-[10px] items-end">
            <div className="flex flex-col w-full gap-[1px]">
              <h2 className="text-[var(--MainText)] text-[20px] font-semibold line-clamp-1">
                {title}
              </h2>
              <p className="text-[15px] text-[var(--TextSecondary)] font-semibold line-clamp-1">
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
              <div className="flex flex-col justify-between items-end">
                <Trash2
                  className="w-[22px] h-[22px] text-[var(--Danger)] -mt-[60px] cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                />
                <p className="text-[15px] text-[var(--MainText)] font-semibold">
                  100%
                </p>
              </div>
            )}
            {uploadStatus === "failed" && (
              <div className="flex flex-col justify-between items-end">
                <Trash2
                  className="w-[22px] h-[22px] text-[var(--Danger)] -mt-[60px] cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                />
                <p className="text-[15px] text-[var(--MainText)] font-semibold">
                  0%
                </p>
              </div>
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
      <ModalConfirmDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        itemName={title}
      />
    </div>
  );
}
