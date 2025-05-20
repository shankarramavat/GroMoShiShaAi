import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RiMedalLine, RiUserFollowLine } from "react-icons/ri";

interface TopPerformer {
  id: number;
  name: string;
  earnings_this_month: number | null;
  profile_image_url: string | null;
  rank?: number;
}

interface LeaderboardSectionProps {
  topPerformers: TopPerformer[];
  onFollowClick?: (partnerId: number) => void;
}

export default function LeaderboardSection({ topPerformers, onFollowClick }: LeaderboardSectionProps) {
  // Format earnings as currency
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "₹0";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get medal icon based on rank
  const getMedalIcon = (rank: number) => {
    const medalColors = {
      1: "text-yellow-500",
      2: "text-gray-400",
      3: "text-amber-700",
    };
    
    return <RiMedalLine className={`h-5 w-5 ${medalColors[rank as keyof typeof medalColors] || "text-blue-500"}`} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <RiMedalLine className="h-5 w-5 mr-2 text-yellow-500" />
        <h2 className="text-xl font-bold">Top Performers</h2>
      </div>

      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">This Month's Leaders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => {
              const rank = performer.rank || index + 1;
              return (
                <div key={performer.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6">
                      {getMedalIcon(rank)}
                    </div>
                    <Avatar>
                      <AvatarImage src={performer.profile_image_url || ""} alt={performer.name} />
                      <AvatarFallback>{performer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{performer.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(performer.earnings_this_month)} this month
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center space-x-1"
                    onClick={() => onFollowClick && onFollowClick(performer.id)}
                  >
                    <RiUserFollowLine className="h-4 w-4" />
                    <span>Follow</span>
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}