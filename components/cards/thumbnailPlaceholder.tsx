import React from "react";
import { useEffect, useState } from "react";

interface ThumbnailPlaceholderProps {
  status: string;
}

const ThumbnailPlaceholder: React.FC<ThumbnailPlaceholderProps> = ({
  status,
}) => {
  // Tentukan teks dan gaya berdasarkan status
  let content;
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const loadingText = `Loading${".".repeat(loadingStep)}`;

  if (status === "failed") {
    content = (
      <span className="text-lg font-semibold text-[var(--Danger)]">Failed</span>
    );
  } else {
    // Status 'processing' atau 'waiting'
    content = (
      <span className="text-lg font-semibold text-[var(--TextSecondary)]">
        {loadingText}
      </span>
    );
  }

  return (
    // Kontainer utama placeholder
    // Menggunakan kelas yang sama dengan Image Anda untuk ukuran yang konsisten
    <div className="flex items-center justify-center w-[250px] max-sm:w-full h-[120px] max-sm:h-[120px] bg-gray-200 rounded-md">
      {content}
    </div>
  );
};

export default ThumbnailPlaceholder;
