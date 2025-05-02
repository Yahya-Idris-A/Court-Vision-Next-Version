"use client";

import { useRef, useState } from "react";
import { PlayCircle } from "lucide-react";

interface VideoPlayerCardProps {
  thumbnail: string;
  videoSrc: string;
}

const VideoPlayerCard: React.FC<VideoPlayerCardProps> = ({
  thumbnail,
  videoSrc,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handlePlay = () => {
    setIsPlaying(true);
    setTimeout(() => {
      videoRef.current?.play();
    }, 100);
  };

  return (
    <div className="w-[60%] max-xl:w-full bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      <div
        className="relative group cursor-pointer"
        onClick={!isPlaying ? handlePlay : undefined}
      >
        {!isPlaying ? (
          <>
            <img
              src={thumbnail}
              alt="Video Thumbnail"
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <PlayCircle className="text-[#FD6A2A]" size={70} />
            </div>
          </>
        ) : (
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-full object-cover"
            controls
          />
        )}
      </div>
    </div>
  );
};

export default VideoPlayerCard;
