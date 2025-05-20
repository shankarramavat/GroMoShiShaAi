import { useQuery } from "@tanstack/react-query";
import AppHeader from "@/components/layout/AppHeader";
import BottomNavigation from "@/components/layout/BottomNavigation";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import SkillDNAStrandCard from "@/components/dashboard/SkillDNAStrandCard";
import NextBestActionCard from "@/components/dashboard/NextBestActionCard";
import AchievementsCard from "@/components/dashboard/AchievementsCard";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { useEffect } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const { setActiveTab } = useApp();
  
  useEffect(() => {
    setActiveTab("dashboard");
  }, [setActiveTab]);
  
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/partners/dashboard"],
  });

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      
      <main className="flex-grow pb-20">
        <div className="container mx-auto px-4 py-6">
          <WelcomeCard 
            name={user?.name || "Partner"} 
            earningsThisMonth={dashboardData?.earnings_this_month || 32800}
            earningsChangePercent={dashboardData?.earnings_change_percent || 12}
            totalLeads={dashboardData?.total_leads || 28}
            hotLeadsCount={dashboardData?.hot_leads_count || 5}
          />
          
          <SkillDNAStrandCard 
            skills={dashboardData?.skills || [
              { id: 1, name: "Sales Pitch", category: "Sales", rating: 7, max_rating: 10 },
              { id: 2, name: "Product Knowledge", category: "Knowledge", rating: 8, max_rating: 10 },
              { id: 3, name: "Client Handling", category: "Relationship", rating: 6, max_rating: 10 },
              { id: 4, name: "Negotiation", category: "Sales", rating: 5, max_rating: 10 },
              { id: 5, name: "Financial Analysis", category: "Technical", rating: 8, max_rating: 10 },
              { id: 6, name: "Digital Marketing", category: "Marketing", rating: 5, max_rating: 10 },
              { id: 7, name: "Communication", category: "Soft Skills", rating: 9, max_rating: 10 },
              { id: 8, name: "Objection Handling", category: "Sales", rating: 7, max_rating: 10 }
            ]}
            overallProgress={dashboardData?.skill_progress || 65}
          />
          
          <NextBestActionCard 
            action={dashboardData?.next_best_action || {
              id: 1,
              action_type: "call_leads",
              description: "Call 3 high-potential clients. Your conversion rate peaks between 10-11am. Call these clients now for the best results.",
              related_entity_type: "leads",
              related_entity_id: null,
              priority: 1,
              status: "pending"
            }}
            onActionComplete={(actionId) => {
              console.log(`Action ${actionId} completed`);
              // In a real implementation, an API call would be made to mark the action as completed
            }}
          />
          
          <AchievementsCard 
            achievements={dashboardData?.achievements || [
              { 
                id: 1, 
                name: "First Sale", 
                description: "Completed your first sale",
                badge_icon_url: "ri-fire-line",
                achievement_type: "milestone",
                points_awarded: 10,
                earned_at: new Date("2023-04-15")
              },
              { 
                id: 2, 
                name: "5 Insurance Sales", 
                description: "Sold 5 insurance policies",
                badge_icon_url: "ri-award-line",
                achievement_type: "milestone",
                points_awarded: 20,
                earned_at: new Date("2023-06-20")
              },
              { 
                id: 3, 
                name: "Top Performer", 
                description: "Achieved top performer status",
                badge_icon_url: "ri-star-line",
                achievement_type: "recognition",
                points_awarded: 50,
                earned_at: new Date("2023-07-10")
              },
              { 
                id: 4, 
                name: "10 Credit Cards", 
                description: "Sold 10 credit cards",
                badge_icon_url: "ri-bank-card-line", 
                achievement_type: "milestone",
                points_awarded: 30,
                earned_at: null
              },
              { 
                id: 5, 
                name: "Skill Master", 
                description: "Reached level 8 in all skills",
                badge_icon_url: "ri-sword-line",
                achievement_type: "skill",
                points_awarded: 40,
                earned_at: null
              }
            ]}
            totalPoints={dashboardData?.total_achievement_points || 80}
            maxPossiblePoints={dashboardData?.max_possible_achievement_points || 150}
          />
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
