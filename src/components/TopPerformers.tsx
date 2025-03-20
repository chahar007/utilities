
import { useState } from "react";
import { topPerformers, players } from "@/lib/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, TrendingUp, Shield } from "lucide-react";

export function TopPerformers() {
  const [activeTab, setActiveTab] = useState("batsmen");

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Top Performers</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The standout players leading the charts in IPL 2024. Batting,
            bowling, and all-round excellence.
          </p>
        </div>

        <Tabs defaultValue="batsmen" className="w-full max-w-4xl mx-auto" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="batsmen" className="data-[state=active]:bg-ipl-blue data-[state=active]:text-white">
              <Award className="mr-2 h-4 w-4" /> Top Batsmen
            </TabsTrigger>
            <TabsTrigger value="bowlers" className="data-[state=active]:bg-ipl-red data-[state=active]:text-white">
              <TrendingUp className="mr-2 h-4 w-4" /> Top Bowlers
            </TabsTrigger>
            <TabsTrigger value="economy" className="data-[state=active]:bg-ipl-orange data-[state=active]:text-white">
              <Shield className="mr-2 h-4 w-4" /> Best Economy
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="batsmen" className="animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topPerformers.batsmen.map((player, index) => (
                  <div
                    key={player.id}
                    className="glass-card rounded-xl overflow-hidden"
                  >
                    <div
                      className={`h-1 ${
                        index === 0
                          ? "bg-yellow-400"
                          : index === 1
                          ? "bg-gray-300"
                          : index === 2
                          ? "bg-amber-600"
                          : "bg-blue-500"
                      }`}
                    />
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`team-badge ${player.teamId} flex-shrink-0`}
                        >
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {/* Player Image placeholder */}
                            <span className="text-xs font-bold">{player.name.charAt(0)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-lg">{player.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            {
                              players.find((p) => p.teamId === player.teamId)?.teamId.toUpperCase()
                            }
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Runs
                              </span>
                              <span className="font-semibold">{player.runs}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Strike Rate
                              </span>
                              <span className="font-semibold">
                                {player.strikeRate?.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Matches
                              </span>
                              <span className="font-semibold">{player.matches}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bowlers" className="animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topPerformers.bowlers.map((player, index) => (
                  <div
                    key={player.id}
                    className="glass-card rounded-xl overflow-hidden"
                  >
                    <div
                      className={`h-1 ${
                        index === 0
                          ? "bg-yellow-400"
                          : index === 1
                          ? "bg-gray-300"
                          : index === 2
                          ? "bg-amber-600"
                          : "bg-blue-500"
                      }`}
                    />
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`team-badge ${player.teamId} flex-shrink-0`}
                        >
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {/* Player Image placeholder */}
                            <span className="text-xs font-bold">{player.name.charAt(0)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-lg">{player.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            {
                              players.find((p) => p.teamId === player.teamId)?.teamId.toUpperCase()
                            }
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Wickets
                              </span>
                              <span className="font-semibold">{player.wickets}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Economy
                              </span>
                              <span className="font-semibold">
                                {player.economy?.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Matches
                              </span>
                              <span className="font-semibold">{player.matches}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="economy" className="animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topPerformers.economyBowlers.map((player, index) => (
                  <div
                    key={player.id}
                    className="glass-card rounded-xl overflow-hidden"
                  >
                    <div
                      className={`h-1 ${
                        index === 0
                          ? "bg-yellow-400"
                          : index === 1
                          ? "bg-gray-300"
                          : index === 2
                          ? "bg-amber-600"
                          : "bg-blue-500"
                      }`}
                    />
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`team-badge ${player.teamId} flex-shrink-0`}
                        >
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {/* Player Image placeholder */}
                            <span className="text-xs font-bold">{player.name.charAt(0)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-lg">{player.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            {
                              players.find((p) => p.teamId === player.teamId)?.teamId.toUpperCase()
                            }
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Economy
                              </span>
                              <span className="font-semibold">
                                {player.economy?.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Overs
                              </span>
                              <span className="font-semibold">
                                {player.oversBowled}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Wickets
                              </span>
                              <span className="font-semibold">{player.wickets}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
