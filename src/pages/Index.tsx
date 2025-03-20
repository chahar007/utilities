
import { Layout } from "@/components/Layout";
import { PointsTable } from "@/components/PointsTable";
import { TopPerformers } from "@/components/TopPerformers";
import { PlayerComparison } from "@/components/PlayerComparison";
import { useLocation } from "react-router-dom";
import { AdSpot } from "@/components/AdSpot";
import { ViewerCounter } from "@/components/ViewerCounter";

const Index = () => {
  const location = useLocation();
  const isPointsTableRoute = location.pathname === "/points-table";

  return (
    <Layout>
      <div id="content">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">IPL 2023 Season</h2>
            <ViewerCounter />
          </div>
          
          <AdSpot size="970x90" position="Above Points Table" />
        </div>
        
        <div id="points-table">
          <PointsTable />
          {!isPointsTableRoute && <AdSpot size="728x90" position="Below Points Table" />}
        </div>
        
        {!isPointsTableRoute && (
          <>
            <div id="top-performers">
              <TopPerformers />
              <AdSpot size="300x250" position="Below Top Performers" />
            </div>
            
            <div id="player-comparison">
              <PlayerComparison />
              <AdSpot size="970x250" position="Below Player Comparison" />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Index;
