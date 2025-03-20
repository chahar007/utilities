
import { useState, useMemo } from "react";
import { teams } from "@/lib/mockData";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

type SortField = "points" | "nrr" | "matches" | "won" | "lost";
type SortDirection = "asc" | "desc";

export function PointsTable() {
  const [sortField, setSortField] = useState<SortField>("points");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const location = useLocation();
  const isPointsTableRoute = location.pathname === "/points-table";

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortDirection === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }, [teams, sortField, sortDirection]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-4 w-4 inline" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4 inline" />
    );
  };

  return (
    <section id="points-table" className={isPointsTableRoute ? "pt-24 pb-20" : "pt-24 pb-20"}>
      <div className="container mx-auto px-4">
        <div className="overflow-x-auto">
          <Table className="w-full glass-card rounded-xl overflow-hidden">
            <TableHeader className="bg-gray-100/70 dark:bg-gray-800/70">
              <TableRow>
                <TableHead className="text-left">Team</TableHead>
                <TableHead 
                  className="cursor-pointer text-center" 
                  onClick={() => toggleSort("matches")}
                >
                  <span className="hidden sm:inline">Matches</span>
                  <span className="sm:hidden">M</span> {getSortIcon("matches")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-center" 
                  onClick={() => toggleSort("won")}
                >
                  <span className="hidden sm:inline">Won</span>
                  <span className="sm:hidden">W</span> {getSortIcon("won")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-center" 
                  onClick={() => toggleSort("lost")}
                >
                  <span className="hidden sm:inline">Lost</span>
                  <span className="sm:hidden">L</span> {getSortIcon("lost")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-center" 
                  onClick={() => toggleSort("nrr")}
                >
                  NRR {getSortIcon("nrr")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-center" 
                  onClick={() => toggleSort("points")}
                >
                  PTS {getSortIcon("points")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTeams.map((team, index) => (
                <TableRow
                  key={team.id}
                  className={`transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-800/50 ${
                    index === 3 ? "border-b-2 border-gray-200 dark:border-gray-700" : ""
                  }`}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`team-badge ${team.id}`}>
                        <div
                          className="w-8 h-8"
                          style={{
                            backgroundColor: team.primaryColor,
                            borderRadius: "50%",
                          }}
                        ></div>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{team.shortName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                          {team.name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{team.matches}</TableCell>
                  <TableCell className="text-center">{team.won}</TableCell>
                  <TableCell className="text-center">{team.lost}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={
                        team.nrr > 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {team.nrr > 0 ? "+" : ""}
                      {team.nrr.toFixed(3)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-bold">{team.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
          <p>
            Top 4 teams qualify for the playoffs. Net Run Rate (NRR) is used as a
            tiebreaker when teams have equal points.
          </p>
        </div>
      </div>
    </section>
  );
}
