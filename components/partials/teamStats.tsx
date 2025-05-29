"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface MatchStatsCardProps {
  homeLogo: string;
  awayLogo: string;
  totalShots: {
    home: number;
    away: number;
  };
  threePointers: {
    home: number;
    away: number;
  };
  twoPointers: {
    home: number;
    away: number;
  };
}

const getPercentage = (home: number, away: number) => {
  const total = home + away;
  return total === 0 ? 50 : (home / total) * 100;
};

const StatRow = ({
  title,
  homeValue,
  awayValue,
  isLoading,
}: {
  title: string;
  homeValue: number;
  awayValue: number;
  isLoading: boolean;
}) => {
  const percent = getPercentage(homeValue, awayValue);

  if (isLoading) {
    return (
      <div className="flex flex-col w-full justify-center items-center">
        <div className="flex flex-row justify-between w-full">
          <div className="h-8 w-24 bg-gray-300 rounded animate-pulse" />
          <div className="h-8 w-24 bg-gray-300 rounded animate-pulse" />
          <div className="h-8 w-24 bg-gray-300 rounded animate-pulse" />
        </div>
        <div className="overflow-hidden rounded-[10px] bg-[#403D91] h-[20px] w-full">
          <div className="h-full bg-gray-300 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <div className="flex flex-row justify-between w-full">
        <p className="text-[36px] max-sm:text-[20px] text-[#4B465C] font-semibold">
          {homeValue}
        </p>
        <h1 className="text-[36px] max-sm:text-[20px] text-[#4B465C] font-semibold">
          {title}
        </h1>
        <p className="text-[36px] max-sm:text-[20px] text-[#4B465C] font-semibold">
          {awayValue}
        </p>
      </div>
      <div className="overflow-hidden rounded-[10px] bg-[#403D91] h-[20px] w-full">
        <div
          className="h-full bg-[#FD6A2A] transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const MatchStatsCard: React.FC<MatchStatsCardProps> = ({
  homeLogo,
  awayLogo,
  totalShots,
  threePointers,
  twoPointers,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating data fetch delay
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate 2 seconds delay
  }, []);

  return (
    <div className="flex flex-col items-center justify-start w-full p-[20px] gap-[20px] bg-white stroke-[#667085] shadow">
      {/* Team Logos and VS */}
      <div className="flex flex-row gap-[50px] justify-center items-center">
        <div className="flex flex-row items-center justify-end">
          {/* <Image
            src={homeLogo}
            alt="Home Team Logo"
            width={120}
            height={120}
            className="max-sm:w-[60px] max-sm:h-[60px]"
          /> */}
          <p className="text-[30px] text-[#4B465C] font-semibold">Team A</p>
        </div>
        <h1 className="text-[36px] text-[#4B465C] font-semibold">VS</h1>
        <div className="flex flex-row items-center justify-start">
          {/* <Image
            src={awayLogo}
            alt="Away Team Logo"
            width={120}
            height={120}
            className="max-sm:w-[60px] max-sm:h-[60px]"
          /> */}
          <p className="text-[30px] text-[#4B465C] font-semibold">Team B</p>
        </div>
      </div>

      {/* Stats */}
      <StatRow
        title="Total Shots"
        homeValue={totalShots.home}
        awayValue={totalShots.away}
        isLoading={isLoading}
      />
      <StatRow
        title="3 Pointers"
        homeValue={threePointers.home}
        awayValue={threePointers.away}
        isLoading={isLoading}
      />
      <StatRow
        title="2 Pointers"
        homeValue={twoPointers.home}
        awayValue={twoPointers.away}
        isLoading={isLoading}
      />
    </div>
  );
};

export default MatchStatsCard;
