"use client";
import React, { useEffect, useState } from "react";
import VideoPlayerCard from "@/components/partials/videoPlayer";
import TeamStats from "@/components/partials/teamStats";
import EventMap from "@/components/partials/eventMap";
import * as analyzeServices from "@/services/analyzeService";

type AnalysisDetailProps = {
  id: string;
};

type TrackingData = Record<string, unknown>;

const AnalysisDetail: React.FC<AnalysisDetailProps> = ({ id }) => {
  const [videoThumbnail, setVideoThumbnail] = useState("/thumb/thumbnail.jpg");
  const [videoSource, setVideoSource] = useState("");
  const [trackingResult, setTrackingResult] = useState<TrackingData | null>(
    null
  );

  useEffect(() => {
    const getAnalysisData = async () => {
      try {
        const data = await analyzeServices.getVideoDetail(id);
        setVideoThumbnail(data?.video.thumbnail_url || "");
        setVideoSource(data?.video.video_result || "");
        const jsonDownloadUrl = data?.video.tracking_result || "";
        try {
          const response = await fetch(jsonDownloadUrl);
          if (!response.ok) {
            throw new Error(`Gagal mengambil data: ${response.status}`);
          }
          const jsonText = await response.text();
          const data: TrackingData = JSON.parse(jsonText);
          setTrackingResult(data);
        } catch (error) {
          console.error(error);
        }
        console.log(data.video.shot_result);
      } catch (error) {
        console.error("Gagal mengambil data analisis:", error);
      }
    };
    getAnalysisData();
  }, []);
  return (
    <div className="flex flex-col items-center gap-[10px] w-full mt-[32px] max-sm:mt-[16px]">
      {/* Header */}
      <div className="flex flex-row items-center justify-start w-full p-[20px] bg-[var(--CardBackground)] border border-[var(--Border)] shadow">
        <p className="text-[18px] text-[var(--MainText)] font-semibold">
          Detailed Analysis
        </p>
      </div>
      {/* Video Player */}
      {videoSource && videoThumbnail && (
        <VideoPlayerCard thumbnail={videoThumbnail} videoSrc={videoSource} />
      )}
      {/* Stats */}
      <TeamStats totalShots={{ home: 10, away: 10 }} />
      {/* Event Map */}
      {trackingResult && <EventMap trackingResult={trackingResult} />}
    </div>
  );
};

export default AnalysisDetail;
