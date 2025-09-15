"use client";
import React, { useEffect, useState } from "react";
import VideoPlayerCard from "@/components/partials/videoPlayer";
import TeamStats from "@/components/partials/teamStats";
import EventMap from "@/components/partials/eventMap";
import * as analyzeServices from "@/services/analyzeService";

type AnalysisDetailProps = {
  id: string;
};

interface TrackingEntry {
  frame: number;
  player_id: number;
  team_id: number;
  x: number;
  y: number;
}

interface ShotEntry {
  ball_coords: { x: number; y: number };
  frame: number;
  player_coords: { x: number; y: number };
  player_id: number;
  result: string;
  team_id: number;
}

const AnalysisDetail: React.FC<AnalysisDetailProps> = ({ id }) => {
  const [videoThumbnail, setVideoThumbnail] = useState("/thumb/thumbnail.jpg");
  const [videoSource, setVideoSource] = useState("");
  const [trackingResult, setTrackingResult] = useState<TrackingEntry[]>([]);
  const [shotResult, setShotResult] = useState<ShotEntry[]>([]);
  const [courtLength, setCourtLength] = useState<number>(0);
  const [courtWidth, setCourtWidth] = useState<number>(0);

  useEffect(() => {
    const getAnalysisData = async () => {
      try {
        const data = await analyzeServices.getVideoDetail(id);
        const result = await analyzeServices.getVideoAnalysisResult(id);
        setVideoThumbnail(data?.video.thumbnail_url || "");
        setVideoSource(result?.result.video_url || "");
        setCourtLength(data?.video.court_length_px || 0);
        setCourtWidth(data?.video.court_width_px || 0);
        setTrackingResult(result?.result.tracking ?? []);
        setShotResult(result?.result.shot ?? []);
      } catch (error) {
        console.error("Gagal mengambil data analisis:", error);
      }
    };
    getAnalysisData();
  }, []);

  // useEffect(() => {
  //   console.log("video thumbnail: ", videoThumbnail);
  //   console.log("video source: ", videoSource);
  //   console.log("tracking result: ", trackingResult);
  //   console.log("shot result: ", shotResult);
  // }, [videoThumbnail, videoSource, trackingResult, shotResult]);
  return (
    <div className="flex flex-col items-center gap-[10px] w-full mt-[32px] pr-[10px] max-sm:mt-[16px]">
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
      {shotResult && <TeamStats shotResult={shotResult} />}
      {/* Event Map */}
      {trackingResult && shotResult && (
        <EventMap
          trackingResult={trackingResult}
          shotResult={shotResult}
          courtLength={courtLength}
          courtWidth={courtWidth}
        />
      )}
    </div>
  );
};

export default AnalysisDetail;
