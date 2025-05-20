import { useQuery } from "@tanstack/react-query";
import AppHeader from "@/components/layout/AppHeader";
import BottomNavigation from "@/components/layout/BottomNavigation";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import SkillDNACard from "@/components/dashboard/SkillDNACard";
import NextBestActionCard from "@/components/dashboard/NextBestActionCard";
import AchievementsCard from "@/components/dashboard/AchievementsCard";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  
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
          
          <SkillDNACard 
            skills={dashboardData?.skills || [
              { name: "Sales Pitch", rating: 7, max: 10 },
              { name: "Product Knowledge", rating: 8, max: 10 },
              { name: "Client Handling", rating: 6, max: 10 },
              { name: "Negotiation", rating: 5, max: 10 }
            ]}
            skillProgress={dashboardData?.skill_progress || 65}
          />
          
          <NextBestActionCard 
            action={dashboardData?.next_best_action || {
              title: "Call 3 high-potential clients",
              description: "Your conversion rate peaks between 10-11am. Call these clients now for the best results.",
              actionText: "Start Calling"
            }}
          />
          
          <AchievementsCard 
            achievements={dashboardData?.achievements || [
              { 
                id: 1, 
                name: "First Sale", 
                date: "April 2023", 
                icon: "ri-fire-line", 
                completed: true 
              },
              { 
                id: 2, 
                name: "5 Insurance Sales", 
                date: "June 2023", 
                icon: "ri-award-line", 
                completed: true 
              },
              { 
                id: 3, 
                name: "Top Performer", 
                date: "July 2023", 
                icon: "ri-star-line", 
                completed: true 
              },
              { 
                id: 4, 
                name: "10 Credit Cards", 
                date: "In progress", 
                icon: "ri-bank-card-line", 
                completed: false 
              }
            ]}
          />
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
