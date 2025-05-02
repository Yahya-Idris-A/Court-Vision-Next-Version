"use client";
import { useState } from "react";
import { LocateFixed } from "lucide-react";
import Shootmap from "./shootMap";
import HeatMap from "./heatMap";

const TeamEventCard: React.FC = () => {
  const [teamASelectedPlayers, setTeamASelectedPlayers] = useState<boolean[]>(
    new Array(2).fill(false)
  );
  const [teamBSelectedPlayers, setTeamBSelectedPlayers] = useState<boolean[]>(
    new Array(2).fill(false)
  );

  const togglePlayerSelection = (team: "A" | "B", playerIndex: number) => {
    if (team === "A") {
      const newSelection = [...teamASelectedPlayers];
      newSelection[playerIndex] = !newSelection[playerIndex];
      setTeamASelectedPlayers(newSelection);
    } else {
      const newSelection = [...teamBSelectedPlayers];
      newSelection[playerIndex] = !newSelection[playerIndex];
      setTeamBSelectedPlayers(newSelection);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full p-[20px] gap-[16px] bg-white stroke-[#667085] shadow">
      {/* Team Select */}
      <div className="flex flex-row gap-[50px] justify-center items-center">
        <button className="text-[32px] max-sm:text-[16px] text-white font-semibold py-[10px] px-[40px] max-sm:px-[20px] bg-[#FD6A2A] rounded-[40px]">
          Team A
        </button>
        <button className="text-[32px] max-sm:text-[16px] text-white font-semibold py-[10px] px-[40px] max-sm:px-[20px] bg-[#FD6A2A] rounded-[40px]">
          Team B
        </button>
      </div>

      {/* Shotmap Header */}
      <div className="flex flex-row gap-[10px] justify-start items-center w-full">
        <LocateFixed className="!text-[30px] !text-[#667085] max-sm:!text-[20px]" />
        <p className="text-[15px] max-sm:text-[10px] text-[#667085] font-semibold">
          Team Event Shotmap
        </p>
      </div>

      {/* Shotmap */}
      <div className="flex flex-row gap-[30px] max-sm:gap-[8px] justify-start w-full">
        <div className="flex w-1/2">
          <Shootmap />
        </div>
        <div className="flex flex-col gap-[20px] max-sm:gap-[8px] justify-start w-1/2">
          <h1 className="text-[24px] max-sm:text-[14px] text-[#4B465C] font-semibold">
            Team A
          </h1>
          <div className="flex flex-row gap-[10px] justify-start items-center w-full">
            <div className="flex flex-col gap-[10px] justify-start w-1/2">
              <label className="text-[14px] max-sm:text-[8px] font-semibold !text-[#667085]">
                Player 1
                <input
                  type="checkbox"
                  checked={teamASelectedPlayers[0]}
                  onChange={() => togglePlayerSelection("A", 0)}
                  className="text-black custom-checkbox max-sm:!text-[8px]"
                />
              </label>
            </div>
            <div className="flex flex-col gap-[10px] justify-start w-1/2">
              <label className="text-[14px] max-sm:text-[8px] font-semibold !text-[#667085]">
                Player 9
                <input
                  type="checkbox"
                  checked={teamASelectedPlayers[1]}
                  onChange={() => togglePlayerSelection("A", 1)}
                  className="text-black custom-checkbox max-sm:!text-[8px]"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Header */}
      <div className="flex flex-row gap-[10px] justify-start items-center w-full">
        <LocateFixed className="!text-[30px] !text-[#667085] max-sm:!text-[20px]" />
        <p className="text-[15px] max-sm:text-[10px] text-[#667085] font-semibold">
          Team Event Heatmap
        </p>
      </div>

      {/* Heatmap */}
      <HeatMap />
    </div>
  );
};

export default TeamEventCard;
