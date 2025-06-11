"use client";
import { useState, useEffect, useRef } from "react";

import React from "react";
import * as ExtendedEventSource from "extended-eventsource";
import ListVideoCards from "@/components/cards/listVideoCards";
import Pagination from "@/components/partials/pagination";
import * as analyzeService from "@/services/analyzeService";

interface VideoData {
  id: string;
  thumbnail: string;
  title: string;
  date: string;
  uploadProgress: number | null;
  uploadStatus: string;
  detailAnalysisUrl: string;
}

const sampleData = [
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 1",
    date: "2024-08-20",
    uploadProgress: null,
    uploadStatus: "waiting",
    detailAnalysisUrl: "/detail-analyze/1",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 2",
    date: "2024-08-20",
    uploadProgress: 80,
    uploadStatus: "processing",
    detailAnalysisUrl: "/detail-analyze/2",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/3",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/4",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 90,
    uploadStatus: "failed",
    detailAnalysisUrl: "/detail-analyze/5",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/6",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/7",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/8",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/9",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/10",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/11",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/12",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/13",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/14",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/15",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/14",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/15",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/14",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/15",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/14",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/15",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/14",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/15",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/14",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    uploadStatus: "completed",
    detailAnalysisUrl: "/detail-analyze/15",
  },
];

const itemsPerPage = 3;

const Page = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const videosRef = useRef(videos);
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = sampleData.length;
  const currentData = sampleData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getAllVideos = async () => {
    const rawData = await analyzeService.getAllVideos();
    console.log("video data: ", rawData);

    const formattedData: VideoData[] = rawData.map((item) => ({
      id: item.id,
      thumbnail: "/thumb/thumbnail.jpg", // default
      title: item.title,
      date: new Date(item.date).toISOString().split("T")[0] ?? "",
      uploadProgress: null, // initial value
      uploadStatus: item.status, // default
      detailAnalysisUrl: `/detail-analyze/${item.id}`,
    }));

    setVideos(formattedData);
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  useEffect(() => {
    videosRef.current = videos;
  }, [videos]);

  useEffect(() => {
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
      }
    };

    eventSource.onerror = (error) => {
      console.error("Error occurred:", error);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-[10px] w-full mt-[32px] mr-[20px] max-sm:mt-[16px]">
      {/* Header */}
      <div className="flex flex-row items-center justify-start w-full p-[20px] bg-white stroke-[#667085] shadow">
        <p className="text-[18px] text-[#4B465C] font-semibold">
          List of Videos
        </p>
      </div>

      <div className="flex flex-col items-center justify-start w-full gap-[16px]">
        {/* Video Cards */}
        {videos.map((item, index) => (
          <ListVideoCards
            key={index}
            thumbnail={item.thumbnail}
            title={item.title}
            date={item.date}
            uploadProgress={item.uploadProgress}
            uploadStatus={item.uploadStatus}
            detailAnalysisUrl={item.detailAnalysisUrl}
          />
        ))}
      </div>

      {/* List of Videos */}
      <div className="flex flex-col items-center justify-start w-full gap-[16px]">
        {/* Video Cards */}
        {currentData.map((item, index) => (
          <ListVideoCards
            key={index}
            thumbnail={item.thumbnail}
            title={item.title}
            date={item.date}
            uploadProgress={item.uploadProgress}
            uploadStatus={item.uploadStatus}
            detailAnalysisUrl={item.detailAnalysisUrl}
          />
        ))}
      </div>
      {/* Pagination */}
      {sampleData.length > itemsPerPage && (
        <div className="flex mt-4 w-full justify-end mr-[30px]">
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
