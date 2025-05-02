import { useEffect, useRef, useState } from "react";

// Ukuran asli lapangan (misalnya dalam meter, sesuai dengan data koordinat)
const COURT_WIDTH = 14; // FIBA: 28m, NBA: 94ft
const COURT_HEIGHT = 15; // FIBA: 15m, NBA: 50ft

// Data asli koordinat pemain (berdasarkan ukuran lapangan asli)
const shots = [
  { x: 1, y: 1.5, value: "4" },
  { x: 1 / 65, y: 1 / 75, value: "5" },
  { x: 15, y: 14, value: "3" },
  { x: 4, y: 10, value: "2" },
  { x: 1, y: 1, value: "1" },
];

const Shotmap = () => {
  const courtRef = useRef<HTMLImageElement | null>(null);
  const [courtSize, setCourtSize] = useState({ width: 0, height: 0 });
  const [scaledShots, setScaledShots] = useState<
    { x: number; y: number; value: string }[]
  >([]);
  const [scaleX, setScaleX] = useState(0);
  const [scaleY, setScaleY] = useState(0);

  const updateCourtSize = () => {
    setTimeout(initShotmap, 100);
  };

  const initShotmap = async () => {
    try {
      if (courtRef.current) {
        const imageRect = courtRef.current.getBoundingClientRect();
        setCourtSize({
          width: imageRect.width,
          height: imageRect.height,
        });

        const newScaleX = imageRect.width / COURT_WIDTH;
        const newScaleY = imageRect.height / COURT_HEIGHT;
        setScaleX(newScaleX);
        setScaleY(newScaleY);

        const scaled = shots.map((shot) => ({
          // Position from left
          x: (shot.y / COURT_WIDTH) * imageRect.width,
          // Position from top
          y: (shot.x / COURT_HEIGHT) * imageRect.height,
          value: shot.value,
        }));

        setScaledShots(scaled);
      }
    } catch (error) {
      console.error("Error initializing shotmap:", error);
    }
  };

  const handleResize = () => {
    setTimeout(initShotmap, 200);
  };

  useEffect(() => {
    initShotmap();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={courtRef} className="relative w-full">
      {/* Gambar Lapangan */}
      <img
        src="/court/Shotmap.svg"
        className="w-full"
        onLoad={initShotmap}
        alt="Court"
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
