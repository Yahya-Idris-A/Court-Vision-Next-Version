"use client";
import { useState, useRef, useEffect } from "react";
import { LocateFixed } from "lucide-react";
import Shootmap from "./shootMap";
import HeatMap from "./heatMap";
import playerData from "../../public/data/analysis.json";

// Tipe untuk konfigurasi pemain yang akan digunakan di UI
interface PlayerConfig {
  id: string;
  name: string;
}

const TeamEventCard: React.FC = () => {
  const playersData = useRef<Record<string, unknown>>({});
  useEffect(() => {
    // Ambil data pemain dari file JSON
    playersData.current = playerData;
  }, []);

  const [selectedTeam, setSelectedTeam] = useState<"A" | "B">("A");
  const [teamAPlayerConfig, setTeamAPlayerConfig] = useState<PlayerConfig[]>(
    []
  );
  const [teamBPlayerConfig, setTeamBPlayerConfig] = useState<PlayerConfig[]>(
    []
  );
  // State untuk pilihan pemain
  const [selectedPlayersTeamA, setSelectedPlayersTeamA] = useState<string[]>(
    []
  );
  const [selectedPlayersTeamB, setSelectedPlayersTeamB] = useState<string[]>(
    []
  );
  const [selectedPlayerID, setSelectedPlayerID] = useState<string[]>([]);

  // State untuk loading dan error
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect untuk mengambil data saat komponen mount
  useEffect(() => {
    const loadAndProcessData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = playersData.current.players;

        const uniqueTeamAPlayerIds = new Set<number>();
        const uniqueTeamBPlayerIds = new Set<number>();

        if (Array.isArray(data)) {
          for (const entry of data) {
            // Asumsi: team_id 0 adalah Tim A, team_id 1 adalah Tim B
            if (entry.team_id === 0) {
              uniqueTeamAPlayerIds.add(entry.player_id);
            } else if (entry.team_id === 1) {
              uniqueTeamBPlayerIds.add(entry.player_id);
            }
          }
        } else {
          throw new Error("Data pemain tidak valid atau bukan array.");
        }

        const finalTeamAConfig: PlayerConfig[] = Array.from(
          uniqueTeamAPlayerIds
        )
          .sort((a, b) => a - b) // Urutkan berdasarkan ID numerik
          .map((pid) => ({ id: String(pid), name: `Player ${pid}` }));

        const finalTeamBConfig: PlayerConfig[] = Array.from(
          uniqueTeamBPlayerIds
        )
          .sort((a, b) => a - b) // Urutkan berdasarkan ID numerik
          .map((pid) => ({ id: String(pid), name: `Player ${pid}` }));

        setTeamAPlayerConfig(finalTeamAConfig);
        setTeamBPlayerConfig(finalTeamBConfig);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal memuat atau memproses data frame"
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAndProcessData();
  }, []); // Jalankan sekali saat mount

  // useEffect untuk mengatur pemain terpilih default SETELAH konfigurasi tim dimuat
  useEffect(() => {
    // Hanya atur jika konfigurasi sudah ada dan pilihan belum diatur (untuk menghindari override pilihan user)
    if (
      selectedTeam === "A" &&
      teamAPlayerConfig.length > 0 &&
      selectedPlayersTeamA.length === 0
    ) {
      // Tim A terpilih semua secara default saat tim B aktif dan belum ada pilihan
      setSelectedPlayersTeamA(teamAPlayerConfig.map((p) => p.id));
    } else if (
      selectedTeam === "B" &&
      teamBPlayerConfig.length > 0 &&
      selectedPlayersTeamB.length === 0
    ) {
      // Tim B terpilih semua secara default saat tim B aktif dan belum ada pilihan
      setSelectedPlayersTeamB(teamBPlayerConfig.map((p) => p.id));
    }
  }, [
    selectedTeam,
    teamAPlayerConfig,
    teamBPlayerConfig,
    selectedPlayersTeamA.length,
    selectedPlayersTeamB.length,
  ]); // Tambahkan .length agar re-run jika array kosong jadi terisi

  const togglePlayerSelection = (team: "A" | "B", playerIdToToggle: string) => {
    if (team === "A") {
      setSelectedPlayersTeamA((prevSelected) =>
        prevSelected.includes(playerIdToToggle)
          ? prevSelected.filter((id) => id !== playerIdToToggle)
          : [...prevSelected, playerIdToToggle]
      );
    } else {
      // team === 'B'
      setSelectedPlayersTeamB((prevSelected) =>
        prevSelected.includes(playerIdToToggle)
          ? prevSelected.filter((id) => id !== playerIdToToggle)
          : [...prevSelected, playerIdToToggle]
      );
    }
  };

  useEffect(() => {
    if (selectedTeam === "A") {
      setSelectedPlayerID(selectedPlayersTeamA);
    } else {
      setSelectedPlayerID(selectedPlayersTeamB);
    }
  }, [selectedTeam, selectedPlayersTeamA, selectedPlayersTeamB]);

  // Tentukan daftar pemain yang akan ditampilkan di UI berdasarkan tim yang aktif
  const currentPlayerListConfig =
    selectedTeam === "A" ? teamAPlayerConfig : teamBPlayerConfig;
  const currentSelectedPlayerIds =
    selectedTeam === "A" ? selectedPlayersTeamA : selectedPlayersTeamB;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Memuat data tim...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start w-full p-[20px] gap-[16px] bg-white stroke-[#667085] shadow">
      {/* Team Select */}
      <div className="flex flex-row gap-4 md:gap-[50px] justify-center items-center w-full">
        <button
          onClick={() => setSelectedTeam("A")}
          disabled={isLoading}
          className={`text-xl md:text-[32px] max-sm:text-[16px] text-white font-semibold py-2 px-6 md:py-[10px] md:px-[40px] max-sm:px-[20px] rounded-[40px] transition-colors duration-200 ease-in-out cursor-pointer
            ${
              selectedTeam === "A"
                ? "bg-[#FD6A2A]"
                : "bg-gray-400 hover:bg-gray-500"
            }
            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Team A
        </button>
        <button
          onClick={() => setSelectedTeam("B")}
          disabled={isLoading}
          className={`text-xl md:text-[32px] max-sm:text-[16px] text-white font-semibold py-2 px-6 md:py-[10px] md:px-[40px] max-sm:px-[20px] rounded-[40px] transition-colors duration-200 ease-in-out cursor-pointer
            ${
              selectedTeam === "B"
                ? "bg-[#FD6A2A]"
                : "bg-gray-400 hover:bg-gray-500"
            }
            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Team B
        </button>
      </div>
      {/* Pemilihan Pemain */}
      <div className="flex flex-col gap-[30px] max-sm:gap-[15px] justify-start w-full px-2">
        <div className="flex flex-col gap-[15px] max-sm:gap-[8px] justify-start w-full">
          <h1 className="text-lg md:text-[24px] max-sm:text-[14px] text-[#4B465C] font-semibold">
            {selectedTeam === "A" ? "Team A Players" : "Team B Players"}
          </h1>
          {currentPlayerListConfig.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-3">
              {currentPlayerListConfig.map((player) => (
                <label
                  key={player.id}
                  className="flex items-center gap-2 text-xs md:text-[14px] max-sm:text-[10px] font-semibold !text-[#667085] cursor-pointer hover:text-[#FD6A2A]"
                >
                  <input
                    type="checkbox"
                    checked={currentSelectedPlayerIds.includes(player.id)}
                    onChange={() =>
                      togglePlayerSelection(selectedTeam, player.id)
                    }
                    className="form-checkbox h-4 w-4 md:h-5 md:w-5 text-[#FD6A2A] border-gray-300 rounded focus:ring-[#FD6A2A] focus:ring-offset-0"
                  />
                  {player.name}
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Tidak ada pemain tersedia untuk tim ini.
            </p>
          )}
        </div>
      </div>
      {/* Shotmap Header */}
      <div className="flex flex-row gap-[10px] justify-start items-center w-full">
        <LocateFixed className="!text-[30px] !text-[#667085] max-sm:!text-[20px]" />
        <p className="text-[15px] max-sm:text-[10px] text-[#667085] font-semibold">
          {selectedTeam === "A" ? "Team A" : "Team B"} Event Shotmap
        </p>
      </div>
      {/* Shotmap */}
      <div className="flex w-full">
        <Shootmap />
      </div>

      {/* Heatmap Header */}
      <div className="flex flex-row gap-[10px] justify-start items-center w-full">
        <LocateFixed className="!text-[30px] !text-[#667085] max-sm:!text-[20px]" />
        <p className="text-[15px] max-sm:text-[10px] text-[#667085] font-semibold">
          {selectedTeam === "A" ? "Team A" : "Team B"} Event Heatmap
        </p>
      </div>

      {/* Heatmap */}
      <HeatMap playerIds={selectedPlayerID} />
    </div>
  );
};

export default TeamEventCard;
