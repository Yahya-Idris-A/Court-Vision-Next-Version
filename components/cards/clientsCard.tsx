"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

interface Review {
  client: string;
  feedback: string;
  profileImg: string;
  username: string;
  position: string;
  teamImg: string;
  teamName: string;
  message: string;
}

const reviews: Review[] = [
  {
    client: "John Doe",
    feedback: "Website ini sangat membantu!",
    profileImg: "/clients/client1.png", // ganti sesuai asset kamu
    username: "Danny Barth",
    position: "Executive Vice President",
    teamImg: "/clients/team.png",
    teamName: "Oklahoma City Thunder",
    message:
      "It is good to analyse the overall movement and shape of the team, for example to identify areas that were not defended during training. The players are asked to check and watch the video every day.",
  },
  {
    client: "Jane Smith",
    feedback: "Sangat user-friendly dan cepat.",
    profileImg: "/clients/client1.png",
    username: "Sarah Johnson",
    position: "Head Coach",
    teamImg: "/clients/team.png",
    teamName: "Los Angeles Lakers",
    message:
      "Analyzing the team’s strategy daily helps us to maintain high standards and performance.",
  },
  {
    client: "Jane Smith",
    feedback: "Sangat user-friendly dan cepat.",
    profileImg: "/clients/client1.png",
    username: "Sarah Johnson",
    position: "Head Coach",
    teamImg: "/clients/team.png",
    teamName: "Los Angeles Lakers",
    message:
      "Analyzing the team’s strategy daily helps us to maintain high standards and performance.",
  },
  {
    client: "Jane Smith",
    feedback: "Sangat user-friendly dan cepat.",
    profileImg: "/clients/client1.png",
    username: "Sarah Johnson",
    position: "Head Coach",
    teamImg: "/clients/team.png",
    teamName: "Los Angeles Lakers",
    message:
      "Analyzing the team’s strategy daily helps us to maintain high standards and performance.",
  },
  {
    client: "Jane Smith",
    feedback: "Sangat user-friendly dan cepat.",
    profileImg: "/clients/client1.png",
    username: "Sarah Johnson",
    position: "Head Coach",
    teamImg: "/clients/team.png",
    teamName: "Los Angeles Lakers",
    message:
      "Analyzing the team’s strategy daily helps us to maintain high standards and performance.",
  },
];

// Duplikat supaya seamless scroll
const displayedReviews = [...reviews, ...reviews];

export default function HomeClientScroll() {
  const scrollContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollSpeed = 1;
    const interval = setInterval(() => {
      if (scrollContainer.current) {
        scrollContainer.current.scrollLeft += scrollSpeed;
        if (
          scrollContainer.current.scrollLeft >=
          scrollContainer.current.scrollWidth / 2
        ) {
          scrollContainer.current.scrollLeft = 0;
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden w-full">
      <div ref={scrollContainer} className="flex gap-4 w-full overflow-hidden">
        {displayedReviews.map((review, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[43.33%] p-4 max-sm:w-[100%] max-xl:w-[80%]"
          >
            <ClientCard {...review} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientCard({
  profileImg,
  username,
  position,
  teamImg,
  teamName,
  message,
}: Omit<Review, "client" | "feedback">) {
  return (
    <div className="flex flex-col items-center bg-white border border-[#DBDADE] shadow w-full rounded-[16px] ">
      <div className="flex flex-row items-center py-[32px] max-sm:py-[16px] pl-[32px] w-full">
        <div className="relative size-[100px] max-sm:size-[80px]">
          <Image
            src={profileImg}
            alt={username}
            fill
            className="object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col pl-[24px] max-sm:pl-[16px]">
          <h3 className="text-black text-[24px] max-sm:text-[20px] font-semibold">
            {username}
          </h3>
          <p className="text-[#667085] text-[15px] max-sm:text-[11px] font-semibold">
            {position}
          </p>
          <div className="flex flex-row items-center">
            <div className="relative size-[50px] max-sm:size-[30px]">
              <Image
                src={teamImg}
                alt={teamName}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-[#667085] text-[15px] max-sm:text-[11px] font-semibold pl-2">
              {teamName}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-row w-full items-start h-[100px] overflow-hidden">
        <p className="ml-[32px] pl-[10px] pr-[22px] max-sm:py-[16px] text-[13px] max-sm:text-[9px] font-semibold text-[#667085] border-l-2 border-[#38347A]">
          {message}
        </p>
      </div>
    </div>
  );
}
