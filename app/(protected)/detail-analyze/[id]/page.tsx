import { notFound } from "next/navigation";
import VideoPlayerCard from "@/components/partials/videoPlayer";
import TeamStats from "@/components/partials/teamStats";
import EventMap from "@/components/partials/eventMap";

interface PageProps {
  params: {
    id: string;
  };
}

const DetailAnalysisPage = async ({ params }: PageProps) => {
  const { id } = await params;

  // Di sini kamu bisa fetch data berdasarkan ID, atau tampilkan langsung konten
  if (!id) return notFound();

  return (
    <div className="flex flex-col items-center gap-[10px] w-full mt-[32px] max-sm:mt-[16px]">
      {/* Header */}
      <div className="flex flex-row items-center justify-start w-full p-[20px] bg-white stroke-[#667085] shadow">
        <p className="text-[18px] text-[#4B465C] font-semibold">
          Detailed Analysis
        </p>
      </div>
      {/* Video Player */}
      <VideoPlayerCard
        thumbnail="/thumb/thumbnail.jpg"
        videoSrc="/video/Es Teh Manis - 1 minute short movie.mp4"
      />
      {/* Stats */}
      <TeamStats
        totalShots={{ home: 10, away: 10 }}
        threePointers={{ home: 6, away: 5 }}
        twoPointers={{ home: 4, away: 5 }}
      />
      {/* Event Map */}
      <EventMap />
    </div>
  );
};

export default DetailAnalysisPage;
