"use client";
import { useState, useEffect } from "react";

interface MatchStatsCardProps {
  totalShots: {
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
        <p className="text-[36px] max-sm:text-[20px] text-[var(--MainText)] font-semibold">
          {homeValue}
        </p>
        <h1 className="text-[36px] max-sm:text-[20px] text-[var(--MainText)] font-semibold">
          {title}
        </h1>
        <p className="text-[36px] max-sm:text-[20px] text-[var(--MainText)] font-semibold">
          {awayValue}
        </p>
      </div>
      <div className="overflow-hidden rounded-[10px] bg-[var(--MainButton)] h-[20px] w-full">
        <div
          className="h-full bg-[var(--MainOrange)] transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const MatchStatsCard: React.FC<MatchStatsCardProps> = ({ totalShots }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating data fetch delay
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate 2 seconds delay
  }, []);

  return (
    <div className="flex flex-col items-center justify-start w-full p-[20px] gap-[20px] bg-[var(--CardBackground)] border border-[var(--Border)] shadow">
      {/* Team Logos and VS */}
      <div className="flex flex-row gap-[50px] justify-center items-center">
        <div className="flex flex-row items-center justify-end">
          <p className="text-[30px] max-sm:text-[24px] text-[var(--MainText)] font-semibold">
            Team A
          </p>
        </div>
        <h1 className="text-[36px] max-sm:text-[24px] text-[var(--MainText)] font-semibold">
          VS
        </h1>
        <div className="flex flex-row items-center justify-start">
          <p className="text-[30px] text-[var(--MainText)] font-semibold">
            Team B
          </p>
        </div>
      </div>

      {/* Stats */}
      <StatRow
        title="Total Shots"
        homeValue={totalShots.home}
        awayValue={totalShots.away}
        isLoading={isLoading}
      />
    </div>
  );
};

export default MatchStatsCard;
