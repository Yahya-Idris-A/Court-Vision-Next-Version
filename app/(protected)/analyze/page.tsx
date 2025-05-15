"use client";
import { useState, useEffect, useRef } from "react";

import React from "react";
import ListVideoCards from "@/components/cards/listVideoCards";
import Pagination from "@/components/partials/pagination";
import * as analyzeService from "@/services/analyzeService";

interface VideoData {
  id: string;
  thumbnail: string;
  title: string;
  date: string;
  uploadProgress: number | null;
  detailAnalysisUrl: string;
}

const sampleData = [
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 1",
    date: "2024-08-20",
    uploadProgress: null,
    detailAnalysisUrl: "/detail-analyze/1",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 2",
    date: "2024-08-20",
    uploadProgress: 80,
    detailAnalysisUrl: "/detail-analyze/2",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/3",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/4",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/5",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/6",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/7",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/8",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/9",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/10",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/11",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/12",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/13",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/14",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/15",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/14",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/15",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/14",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/15",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/14",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/15",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/14",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/15",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/14",
  },
  {
    thumbnail: "/thumb/thumbnail.jpg",
    title: "Basket Match Day 3",
    date: "2024-08-21",
    uploadProgress: 100,
    detailAnalysisUrl: "/detail-analyze/15",
  },
];

const itemsPerPage = 3;

const page = () => {
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

    const formattedData: VideoData[] = rawData.map((item: any) => ({
      id: item.id,
      thumbnail: "/thumb/thumbnail.jpg", // default
      title: item.title,
      date: new Date(item.date).toISOString().split("T")[0] ?? "",
      uploadProgress: null, // initial value
      detailAnalysisUrl: `/detail-analyze/${item.id}`,
    }));

    setVideos(formattedData);
  };

  const pollAllProgress = async () => {
    try {
      const data = await analyzeService.getAllVideoProgress();
      console.log(data);

      setVideos((prevVideos) =>
        prevVideos.map((video) => {
          const updated = data.find((v: any) => v.id === video.id);
          return updated
            ? { ...video, uploadProgress: updated.uploadProgress }
            : video;
        })
      );
    } catch (err) {
      console.error("Polling error", err);
    }
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  useEffect(() => {
    videosRef.current = videos;
  }, [videos]);

  useEffect(() => {
    const interval = setInterval(() => {
      const unFinished = videosRef.current.filter(
        (v: any) => v.uploadProgress < 100
      );
      const unStarted = videosRef.current.filter(
        (v: any) => v.uploadProgress == null
      );
      console.log(videosRef);

      console.log("unfisih: ", unFinished);
      console.log("unstart: ", unStarted);

      if (unStarted.length !== 0) {
        pollAllProgress();
        console.log("polll 1");
      } else if (unFinished.length !== 0) {
        pollAllProgress();
        console.log("polll 2");
      }
    }, 5000);

    return () => {
      clearInterval(interval);
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

export default page;
