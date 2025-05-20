import { useQuery } from "@tanstack/react-query";
import AppHeader from "@/components/layout/AppHeader";
import BottomNavigation from "@/components/layout/BottomNavigation";
import LeadCard from "@/components/leads/LeadCard";

export default function Leads() {
  const { data: recommendedLeads, isLoading } = useQuery({
    queryKey: ["/api/partners/leads/recommended"],
  });

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      
      <main className="flex-grow pb-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-neutral-800">AI-Recommended Leads</h2>
            <button className="text-sm text-primary font-medium">View All Leads</button>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading recommended leads...</div>
            ) : recommendedLeads && recommendedLeads.length > 0 ? (
              recommendedLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))
            ) : (
              <div className="text-center py-8 bg-white rounded-xl shadow-card p-6">
                <div className="text-neutral-500 mb-2"><i className="ri-search-line text-2xl"></i></div>
                <h3 className="text-lg font-medium">No leads available</h3>
                <p className="text-neutral-500 mt-2">Check back soon for new AI-recommended leads</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
