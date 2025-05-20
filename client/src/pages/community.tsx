import { useQuery } from "@tanstack/react-query";
import AppHeader from "@/components/layout/AppHeader";
import BottomNavigation from "@/components/layout/BottomNavigation";
import LeaderboardSection from "@/components/community/LeaderboardSection";
import BestPracticesSection from "@/components/community/BestPracticesSection";

export default function Community() {
  const { data: communityData, isLoading } = useQuery({
    queryKey: ["/api/community"],
  });

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      
      <main className="flex-grow pb-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-neutral-800">Community</h2>
            <button className="text-sm text-primary font-medium">View All</button>
          </div>
          
          <LeaderboardSection 
            topPerformers={communityData?.top_performers || [
              {
                id: 1,
                name: "Neha Gupta",
                sales_amount: 87500,
                profile_image_url: "https://images.unsplash.com/photo-1601412436009-d964bd02edbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
                rank: 1
              },
              {
                id: 2,
                name: "Ravi Desai",
                sales_amount: 72300,
                profile_image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
                rank: 2
              },
              {
                id: 3,
                name: "Anisha Shah",
                sales_amount: 68750,
                profile_image_url: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
                rank: 3
              }
            ]} 
          />
          
          <BestPracticesSection 
            bestPractices={communityData?.best_practices || [
              {
                id: 1,
                author: {
                  name: "Amit Verma",
                  profile_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
                },
                content: "I've found that sending a personalized WhatsApp message before calling leads to a 40% higher response rate. Try referencing something specific from their profile.",
                likes: 24,
                comments: 5,
                days_ago: 2
              },
              {
                id: 2,
                author: {
                  name: "Neha Gupta",
                  profile_image_url: "https://images.unsplash.com/photo-1601412436009-d964bd02edbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
                },
                content: "For health insurance, I always ask about their parents first. It builds trust and shows you care about family, not just making a sale. My closing rate improved by 35%.",
                likes: 36,
                comments: 12,
                days_ago: 5
              }
            ]} 
          />
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
