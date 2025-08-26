"use client";
import { useState, useEffect, useRef } from "react";

import React from "react";
import * as ExtendedEventSource from "extended-eventsource";
import Pagination from "@/components/partials/pagination";
import Link from "next/link";
import * as analyzeService from "@/services/analyzeService";
import dynamic from "next/dynamic";
import { callToaster } from "@/lib/toaster";

const ListVideoCards = dynamic(
  () => import("@/components/cards/listVideoCards"),
  {
    loading: () => (
      <div className="w-full h-[200px] bg-gray-200 animate-pulse rounded-md" />
    ),
    ssr: false,
  }
);

interface VideoData {
  id: string;
  thumbnail_url: string;
  title: string;
  date: string;
  venue: string;
  uploadProgress: number | null;
  uploadStatus: string;
  detailAnalysisUrl: string;
}

const itemsPerPage = 5;

const Page = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const videosRef = useRef(videos);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const eventSourceRef = useRef<EventSource | null>(null);

  const totalItems = videos.length;
  const currentData = videos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getAllVideos = async () => {
    const rawData = await analyzeService.getAllVideos();
    const formattedData: VideoData[] = rawData.map((item) => ({
      id: item.id,
      thumbnail_url: item.thumbnail_url ?? "/thumb/thumbnail.jpg",
      title: item.title,
      date: new Date(item.date).toISOString().split("T")[0] ?? "",
      venue: item.venue,
      uploadProgress: null, // initial value
      uploadStatus: item.status,
      detailAnalysisUrl: `/detail-analyze/${item.id}`,
    }));
    setVideos(formattedData);
    setIsLoading(false);
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  useEffect(() => {
    videosRef.current = videos;
  }, [videos]);

  const getVideosThumbById = async (id: string) => {
    const rawData = await analyzeService.getVideoDetail(id);
    return rawData.video.thumbnail_url;
  };

  useEffect(() => {
    const needsToListen = videos.some(
      (video) =>
        video.uploadStatus === "waiting" || video.uploadStatus === "processing"
    );
    if (needsToListen && !eventSourceRef.current) {
      const token = analyzeService.getToken();

      const eventSource = new ExtendedEventSource.EventSource(
        analyzeService.endPointUploadProgress,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      eventSource.onmessage = (event: MessageEvent) => {
        if (event.data) {
          const data = JSON.parse(event?.data);

          const updatedVideos = videosRef.current.map((video) =>
            video.id === data.video.id
              ? {
                ...video,
                uploadProgress: data.video.progress,
                uploadStatus: data.video.status,
              }
              : video
          );
          setVideos(updatedVideos);
          console.log("event data: ", data);
          if (data.video.status === "completed") {
            getVideosThumbById(data.video.id).then((newThumb) => {
              const updatedVideos = videosRef.current.map((video) =>
                video.id === data.video.id
                  ? {
                    ...video,
                    thumbnail_url: newThumb,
                  }
                  : video
              );
              setVideos(updatedVideos);
            });
          }
        }
      };

      eventSource.onerror = (error) => {
        console.error("Error occurred:", error);
      };
      eventSourceRef.current = eventSource;

      return () => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null; // Reset ref
        }
      };
    }
  }, [videos]);

  const handleUpdate = (videoId: string) => {
    try {
      setVideos((prevVideos) =>
        prevVideos.filter((video) => video.id !== videoId)
      );
      callToaster("success", "Video deleted successfully");
    } catch (error) {
      console.error("Failed to update videos:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-[10px] w-full mt-[32px] pr-[10px] max-sm:mt-[16px]">
      {/* Header */}
      <div className="flex flex-row items-center justify-start w-full p-[20px] bg-[var(--CardBackground)] border border-[var(--Border)] shadow">
        <p className="text-[18px] text-[var(--MainText)] font-semibold">
          List of Videos
        </p>
      </div>
      {videos.length > 0 ? (
        <div className="flex flex-col items-center justify-start w-full gap-[16px]">
          {/* Video Cards */}
          {currentData.map((item, index) => (
            <ListVideoCards
              key={index}
              id={item.id}
              thumbnail={item.thumbnail_url}
              title={item.title}
              date={item.date}
              venue={item.venue}
              uploadProgress={item.uploadProgress}
              uploadStatus={item.uploadStatus}
              detailAnalysisUrl={item.detailAnalysisUrl}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      ) : isLoading ? (
        <div />
      ) : (
        <div className="flex flex-col items-center justify-start w-full gap-[16px]">
          <p className="text-[var(--MainText)] text-[34px]">
            You don&apos;t have data to analyze, tap{" "}
            <Link
              href="/upload"
              className="text-[var(--MainButton)] hover:underline hover:text-[var(--ButtonHover)]"
            >
              here
            </Link>{" "}
            to upload new data
          </p>
        </div>
      )}
      {/* Pagination */}
      {videos.length > itemsPerPage && (
        <div className="flex mt-4 w-full justify-end mr-[30px] max-sm:mr-[10px]">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default Page;
