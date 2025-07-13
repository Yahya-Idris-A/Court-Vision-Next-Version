import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

// Ukuran asli lapangan (misalnya dalam meter, sesuai dengan data koordinat)
const COURT_WIDTH = 28; // FIBA: 28m, NBA: 94ft
const COURT_HEIGHT = 15; // FIBA: 15m, NBA: 50ft

type ShotData = Record<string, unknown>;

type ShotmapProps = {
  playerIds: string[];
  shotData: ShotData;
  virtualCourtWidth?: number;
  virtualCourtHeight?: number;
};

const Shotmap: React.FC<ShotmapProps> = ({
  playerIds,
  shotData,
  virtualCourtWidth,
  virtualCourtHeight,
}) => {
  const courtRef = useRef<HTMLImageElement | null>(null);
  const scaleXRef = useRef(0);
  const scaleYRef = useRef(0);
  const [scaledShots, setScaledShots] = useState<
    { x: number; y: number; value: string }[]
  >([]);

  const initShotmap = useCallback(async (playerId: string) => {
    if (!playerId || playerIds.length === 0) {
      setScaledShots([]);
    } else {
      const coordinateCounts = new Map();
      const virtualWidth = virtualCourtWidth || 0;
      const virtualHeight = virtualCourtHeight || 0;

      const scaleXForPlayer = COURT_WIDTH / virtualWidth;
      const scaleYForPlayer = COURT_HEIGHT / virtualHeight;
      if (shotData && "shots" in shotData && Array.isArray(shotData.shots)) {
        const filteredShots = shotData.shots.filter((shot) =>
          playerId.includes(String(shot.player_id))
        );
        for (const shot of filteredShots) {
          if (shot.player_coords) {
            const coords = shot.player_coords;
            const key = `${coords.x * scaleXForPlayer},${
              coords.y * scaleYForPlayer
            }`;
            const currentCount = coordinateCounts.get(key) || 0;
            coordinateCounts.set(key, currentCount + 1);
          }
        }
      } else {
        console.warn("shotData tidak memiliki properti 'shots' yang valid.");
      }
      const formattedData = Array.from(coordinateCounts, ([key, count]) => {
        const [xStr, yStr] = key.split(",");

        // Ubah string x dan y menjadi angka
        const x = parseInt(xStr, 10);
        const y = parseInt(yStr, 10);
        return {
          x: x,
          y: y,
          value: String(count),
        };
      });

      try {
        if (courtRef.current) {
          const imageRect = courtRef.current.getBoundingClientRect();
          scaleXRef.current = imageRect.width / COURT_WIDTH;
          scaleYRef.current = imageRect.height / COURT_HEIGHT;
          const scaled = formattedData.map((shot) => ({
            // Position from left
            x: shot.x * scaleXRef.current,
            // Position from top
            y: shot.y * scaleYRef.current,
            value: shot.value,
          }));

          setScaledShots(scaled);
        }
      } catch (error) {
        console.error("Error initializing shotmap:", error);
      }
    }
  }, []);

  const handleResize = useCallback(() => {
    initShotmap(playerIds[0]);
  }, [initShotmap]);

  useEffect(() => {
    initShotmap(playerIds[0]);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [initShotmap, handleResize, playerIds]);

  return (
    <div ref={courtRef} className="relative w-full">
      {/* Gambar Lapangan */}
      <Image
        src="/court/bg-court.svg"
        alt="Basketball Court"
        width={0}
        height={0}
        onLoad={() => initShotmap(playerIds[0])}
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
