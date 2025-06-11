import { useEffect, useRef } from "react";
import coordinatesData from "../../public/data/analysis.json";
import Image from "next/image";
import { useCallback } from "react";

type HeatMapProps = {
  playerIds: string[];
};

interface Point {
  x: number;
  y: number;
}

interface HeatmapPoint extends Point {
  value: number;
}

interface HeatmapData {
  max: number;
  data: HeatmapPoint[];
}

const COURT_WIDTH = 28;
const COURT_HEIGHT = 15;

const CourtHeatmp: React.FC<HeatMapProps> = ({ playerIds }) => {
  const courtContainerRef = useRef<HTMLDivElement | null>(null);
  const courtImageRef = useRef<HTMLImageElement | null>(null);

  const playersCoordinates = useRef<Record<string, Point[]>>({});
  const finalDataCoordinates = useRef<HeatmapData>({ max: 0, data: [] });

  const scaleXRef = useRef(0);
  const scaleYRef = useRef(0);
  const heatmapRadius = 100;

  const loadHeatmapJs = async () => {
    if (typeof window !== "undefined" && window.h337) {
      return window.h337;
    }

    return new Promise<typeof window.h337>((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/heatmap.js/2.0.2/heatmap.min.js";
      script.async = true;
      script.onload = () => resolve(window.h337);
      script.onerror = () => reject(new Error("Failed to load heatmap.js"));
      document.head.appendChild(script);
    });
  };

  const getHeatmapData = (playerIds?: string[]) => {
    const heatmapMap = new Map<string, number>();
    let maxIntensity = Number.MIN_VALUE;
    // Cek apakah data koordinat pemain sudah tersedia
    if (
      !playersCoordinates.current ||
      Object.keys(playersCoordinates.current).length === 0
    ) {
      console.warn("⚠️ Data pemain belum dimuat.");
      return;
    }

    const selectedIds =
      playerIds && playerIds.length > 0
        ? playerIds
        : Object.keys(playersCoordinates.current);

    // console.log("Selected player IDs:", playerIds);
    let virtualWidth = 0;
    let virtualHeight = 0;

    selectedIds.forEach((id) => {
      if (!playersCoordinates.current[id]) return;

      playersCoordinates.current[id].forEach((point) => {
        if (virtualWidth < point.x) virtualWidth = point.x;
        if (virtualHeight < point.y) virtualHeight = point.y;
      });
    });

    const scaleXForPlayer = COURT_WIDTH / virtualWidth;
    const scaleYForPlayer = COURT_HEIGHT / virtualHeight;

    selectedIds.forEach((id) => {
      playersCoordinates.current[id]?.forEach((point) => {
        const key = `${Math.round(point.x * scaleXForPlayer)},${Math.round(
          point.y * scaleYForPlayer
        )}`;
        heatmapMap.set(key, (heatmapMap.get(key) || 0) + 1);
      });
    });

    const heatmapData: HeatmapPoint[] = Array.from(
      heatmapMap,
      ([key, value]) => {
        const [x, y] = key.split(",").map(Number);
        maxIntensity = Math.max(maxIntensity, value);
        return { x, y, value };
      }
    );

    finalDataCoordinates.current = { max: maxIntensity, data: heatmapData };

    // console.log("Final heatmap data:", heatmapData);
  };

  const initHeatmap = useCallback(async () => {
    const container = courtContainerRef.current;
    const image = courtImageRef.current;

    if (!container || !image) return;

    try {
      const imageRect = image.getBoundingClientRect();
      scaleXRef.current = imageRect.width / COURT_WIDTH;
      scaleYRef.current = imageRect.height / COURT_HEIGHT;

      const h337 = await loadHeatmapJs();
      const heatmap = h337.create({
        container,
        radius: heatmapRadius,
        maxOpacity: 0.6,
        minOpacity: 0.2,
        blur: 0.85,
      });

      getHeatmapData(playerIds);

      const scaledDataPoints = {
        max: finalDataCoordinates.current.max,
        min: 0,
        data: finalDataCoordinates.current.data.map((point) => ({
          x: Math.round(point.x * scaleXRef.current),
          y: Math.round(point.y * scaleYRef.current),
          value: point.value,
        })),
      };

      heatmap.setData(scaledDataPoints);
      // console.log("Heatmap data set:", scaledDataPoints);
    } catch (error) {
      console.error("Error initializing heatmap:", error);
    }
  }, []);

  const handleImageLoad = () => {
    setTimeout(initHeatmap, 100);
  };

  useEffect(() => {
    // Isi koordinat pemain saat mount
    // Transform array to Record<string, Point[]>
    playersCoordinates.current = coordinatesData.players.reduce(
      (
        acc: Record<string, Point[]>,
        curr: { player_id: number; x: number; y: number }
      ) => {
        const key = String(curr.player_id);
        if (!acc[key]) acc[key] = [];
        acc[key].push({ x: curr.x, y: curr.y });
        return acc;
      },
      {}
    );

    // --- ResizeObserver Setup ---
    const containerElement = courtContainerRef.current;
    let resizeObserver: ResizeObserver | null = null;

    if (containerElement) {
      resizeObserver = new ResizeObserver(() => {
        // console.log("Court container resized, triggering heatmap update.");
        // Tidak perlu setTimeout di sini jika updateOrInitializeHeatmap sudah menangani async dengan baik
        const currentContainer = courtContainerRef.current;
        if (currentContainer) {
          const canvas = currentContainer.querySelector("canvas");
          if (canvas) {
            canvas.remove();
            initHeatmap();
          }
        }
      });
      resizeObserver.observe(containerElement);
    }

    return () => {
      if (resizeObserver && containerElement) {
        resizeObserver.unobserve(containerElement);
      }
    };
  }, [playerIds]);

  return (
    <div className="relative w-full" ref={courtContainerRef}>
      {/* <img
        ref={courtImageRef}
        src="/court/bg-court.svg"
        alt="Basketball Court"
        className="w-full"
        onLoad={handleImageLoad}
      /> */}
      <Image
        src="/court/bg-court.svg"
        alt="Basketball Court"
        width={0}
        height={0}
        ref={courtImageRef}
        onLoad={handleImageLoad}
        className="object-cover w-full h-full"
      />
    </div>
  );
};

export default CourtHeatmp;
