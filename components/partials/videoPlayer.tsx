"use client";

import { useRef, useState } from "react";
import { PlayCircle } from "lucide-react";
import Image from "next/image";

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
            <Image
              src={thumbnail}
              alt="Video Thumbnail"
              width={900}
              height={500}
              priority
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
      {/* <video
        ref={videoRef}
        src="https://minio.nextar.uno/courtvision/uploads/0dfae2a6-5100-4ea4-b018-d2e0efb8a228.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=Xe9a2WZI2iad2CS1r7PF%2F20250614%2Fcentralindia%2Fs3%2Faws4_request&X-Amz-Date=20250614T145146Z&X-Amz-Expires=3600&X-Amz-Signature=31ac27b27d6e34eff32b250ef53d2dfa343d58afcaaa703dead81b794ef1d236&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
        className="w-full h-full object-cover"
        controls
      /> */}
    </div>
  );
};

export default VideoPlayerCard;
