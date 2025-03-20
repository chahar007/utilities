
import { useState } from "react";
import { players } from "@/lib/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from "recharts";

export function PlayerComparison() {
  const [player1, setPlayer1] = useState(players[0].id);
  const [player2, setPlayer2] = useState(players[1].id);

  const selectedPlayer1 = players.find((p) => p.id === player1);
  const selectedPlayer2 = players.find((p) => p.id === player2);

  // Only show batsmen for simplicity in this comparison
  const eligiblePlayers = players.filter(p => p.role === "Batsman" || p.role === "All-rounder");

  const getPlayerStats = (player) => {
    if (!player) return [];

    const stats = [
      {
        subject: "Runs",
        A: player.runs || 0,
        fullMark: 700,
      },
      {
        subject: "Strike Rate",
        A: player.strikeRate || 0,
        fullMark: 200,
      },
      {
        subject: "Average",
        A: player.average || 0,
        fullMark: 60,
      },
      {
        subject: "Matches",
        A: player.matches || 0,
        fullMark: 14,
      },
    ];

    if (player.wickets) {
      stats.push({
        subject: "Wickets",
        A: player.wickets || 0,
        fullMark: 30,
      });
    }

    if (player.economy) {
      stats.push({
        subject: "Economy",
        A: player.economy || 0,
        fullMark: 12,
      });
    }

    return stats;
  };

  const player1Stats = getPlayerStats(selectedPlayer1);
  const player2Stats = getPlayerStats(selectedPlayer2);

  const formatStat = (player1Stat, player2Stat) => {
    return [
      {
        ...player1Stat,
        Player1: player1Stat.A,
        Player2: player2Stat.A,
      },
    ];
  };

  const comparisonData = player1Stats.map((stat, index) => ({
    subject: stat.subject,
    Player1: stat.A,
    Player2: player2Stats[index]?.A || 0,
    fullMark: stat.fullMark,
  }));

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Player Comparison</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Compare stats between any two players to see who has the edge. Select from the dropdown menus below.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Player 1
              </label>
              <Select
                value={player1}
                onValueChange={(value) => setPlayer1(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select player 1" />
                </SelectTrigger>
                <SelectContent>
                  {eligiblePlayers.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name} ({player.teamId.toUpperCase()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Player 2
              </label>
              <Select
                value={player2}
                onValueChange={(value) => setPlayer2(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select player 2" />
                </SelectTrigger>
                <SelectContent>
                  {eligiblePlayers.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name} ({player.teamId.toUpperCase()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/3 mb-8 lg:mb-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`team-badge ${selectedPlayer1?.teamId} mb-3`}>
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold">
                        {selectedPlayer1?.name.charAt(0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{selectedPlayer1?.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedPlayer1?.teamId.toUpperCase()} - {selectedPlayer1?.role}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className={`team-badge ${selectedPlayer2?.teamId} mb-3`}>
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold">
                        {selectedPlayer2?.name.charAt(0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{selectedPlayer2?.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedPlayer2?.teamId.toUpperCase()} - {selectedPlayer2?.role}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Runs</span>
                    <div className="flex gap-4">
                      <span className="font-semibold">{selectedPlayer1?.runs || 0}</span>
                      <span className="text-gray-400">vs</span>
                      <span className="font-semibold">{selectedPlayer2?.runs || 0}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Strike Rate</span>
                    <div className="flex gap-4">
                      <span className="font-semibold">{selectedPlayer1?.strikeRate?.toFixed(2) || 0}</span>
                      <span className="text-gray-400">vs</span>
                      <span className="font-semibold">{selectedPlayer2?.strikeRate?.toFixed(2) || 0}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Average</span>
                    <div className="flex gap-4">
                      <span className="font-semibold">{selectedPlayer1?.average?.toFixed(2) || 0}</span>
                      <span className="text-gray-400">vs</span>
                      <span className="font-semibold">{selectedPlayer2?.average?.toFixed(2) || 0}</span>
                    </div>
                  </div>
                  {(selectedPlayer1?.wickets || selectedPlayer2?.wickets) && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Wickets</span>
                      <div className="flex gap-4">
                        <span className="font-semibold">{selectedPlayer1?.wickets || 0}</span>
                        <span className="text-gray-400">vs</span>
                        <span className="font-semibold">{selectedPlayer2?.wickets || 0}</span>
                      </div>
                    </div>
                  )}
                  {(selectedPlayer1?.economy || selectedPlayer2?.economy) && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Economy</span>
                      <div className="flex gap-4">
                        <span className="font-semibold">{selectedPlayer1?.economy?.toFixed(2) || 0}</span>
                        <span className="text-gray-400">vs</span>
                        <span className="font-semibold">{selectedPlayer2?.economy?.toFixed(2) || 0}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full lg:w-2/3 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={comparisonData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
                    <Radar
                      name={selectedPlayer1?.name}
                      dataKey="Player1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name={selectedPlayer2?.name}
                      dataKey="Player2"
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.6}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
