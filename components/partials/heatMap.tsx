import { useEffect, useRef, useState } from "react";
import coordinatesData from "../../public/data/trackingData.json";

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

declare global {
  interface Window {
    h337: any;
  }
}

const COURT_WIDTH = 28;
const COURT_HEIGHT = 15;

export default function CourtHeatmap() {
  const courtContainerRef = useRef<HTMLDivElement | null>(null);
  const courtImageRef = useRef<HTMLImageElement | null>(null);

  const [heatmapInstance, setHeatmapInstance] = useState<any>(null);
  const playersCoordinates = useRef<Record<string, Point[]>>({});

  const finalDataCoordinates = useRef<HeatmapData>({ max: 0, data: [] });

  const scaleXRef = useRef(0);
  const scaleYRef = useRef(0);
  const heatmapRadius = 100;

  const loadHeatmapJs = async () => {
    if (typeof window !== "undefined" && (window as any).h337) {
      return (window as any).h337;
    }

    return new Promise<any>((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/heatmap.js/2.0.2/heatmap.min.js";
      script.async = true;
      script.onload = () => resolve((window as any).h337);
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

    console.log("Selected player IDs:", playerIds && playerIds.length);
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

    console.log("Final heatmap data:", heatmapData);
  };

  const initHeatmap = async () => {
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

      setHeatmapInstance(heatmap);

      getHeatmapData([]);

      const scaledDataPoints = {
        max: finalDataCoordinates.current.max,
        data: finalDataCoordinates.current.data.map((point) => ({
          x: Math.round(point.x * scaleXRef.current),
          y: Math.round(point.y * scaleYRef.current),
          value: point.value,
        })),
      };

      heatmap.setData(scaledDataPoints);
      console.log("Heatmap data set:", scaledDataPoints);
    } catch (error) {
      console.error("Error initializing heatmap:", error);
    }
  };

  const handleImageLoad = () => {
    setTimeout(initHeatmap, 100);
  };

  const handleResize = () => {
    setTimeout(initHeatmap, 200);
  };

  useEffect(() => {
    // Isi koordinat pemain saat mount
    playersCoordinates.current = coordinatesData;

    // Jalankan hanya jika data sudah ada
    if (Object.keys(playersCoordinates.current).length > 0) {
      console.log(
        "🎯 Data pemain berhasil dimuat:",
        playersCoordinates.current
      );

      // Mulai inisialisasi heatmap
      if (courtImageRef.current?.complete) {
        initHeatmap();
      }
    } else {
      console.warn("⚠️ Data pemain masih kosong saat mount.");
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-full" ref={courtContainerRef}>
      <img
        ref={courtImageRef}
        src="/court/Heatmap.svg"
        alt="Basketball Court"
        className="w-full"
        onLoad={handleImageLoad}
      />
    </div>
  );
}
