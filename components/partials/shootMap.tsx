import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

// Ukuran asli lapangan (misalnya dalam meter, sesuai dengan data koordinat)
const COURT_WIDTH = 28; // FIBA: 28m, NBA: 94ft
const COURT_HEIGHT = 15; // FIBA: 15m, NBA: 50ft

type ShotData = Record<string, unknown>;

type ShotmapProps = {
  playerIds: string[];
  shotData: ShotData;
};

// Data asli koordinat pemain (berdasarkan ukuran lapangan asli)
const shots = [
  { x: 1, y: 1.5, value: "4" },
  { x: 0, y: 0, value: "5" },
  { x: 15, y: 14, value: "3" },
  { x: 4, y: 10, value: "2" },
  { x: 1, y: 1, value: "1" },
];

const Shotmap: React.FC<ShotmapProps> = ({ playerIds, shotData }) => {
  const courtRef = useRef<HTMLImageElement | null>(null);
  const [scaledShots, setScaledShots] = useState<
    { x: number; y: number; value: string }[]
  >([]);

  const initShotmap = useCallback(async () => {
    try {
      if (courtRef.current) {
        const imageRect = courtRef.current.getBoundingClientRect();
        const scaled = shots.map((shot) => ({
          // Position from left
          x: (shot.x / COURT_WIDTH) * imageRect.width,
          // Position from top
          y: (shot.y / COURT_HEIGHT) * imageRect.height,
          value: shot.value,
        }));

        setScaledShots(scaled);
      }
    } catch (error) {
      console.error("Error initializing shotmap:", error);
    }
  }, []);

  const handleResize = useCallback(() => {
    initShotmap();
  }, [initShotmap]);

  useEffect(() => {
    initShotmap();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [initShotmap, handleResize]);

  return (
    <div ref={courtRef} className="relative w-full">
      {/* Gambar Lapangan */}
      {/* <img
        src="/court/bg-court.svg"
        className="w-full"
        onLoad={initShotmap}
        alt="Court"
      /> */}
      <Image
        src="/court/bg-court.svg"
        alt="Basketball Court"
        width={0}
        height={0}
        onLoad={initShotmap}
        className="object-cover w-full h-full"
      />

      {/* Titik Tembakan Pemain */}
      {scaledShots.map((shot, index) => (
        <div
          key={index}
          className="shot w-[20px] h-[20px] text-[10px] max-xl:w-[10px] max-xl:h-[10px] max-xl:text-[8px] max-sm:w-[8px] max-sm:h-[8px] max-sm:text-[5px]"
          style={{
            left: `${shot.x - 10}px`,
            top: `${shot.y - 10}px`,
          }}
        >
          {shot.value}
        </div>
      ))}
    </div>
  );
};

export default Shotmap;
