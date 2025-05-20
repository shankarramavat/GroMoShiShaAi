import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RiTrophyLine } from "react-icons/ri";

interface Achievement {
  id: number;
  name: string;
  description: string;
  badge_icon_url: string | null;
  points_awarded: number | null;
  achievement_type: string;
  earned_at?: Date | null;
}

interface AchievementsCardProps {
  achievements: Achievement[];
  totalPoints?: number;
  maxPossiblePoints?: number;
}

export default function AchievementsCard({ 
  achievements, 
  totalPoints = 0, 
  maxPossiblePoints = 100 
}: AchievementsCardProps) {
  
  // Group achievements by type
  const groupedAchievements = achievements.reduce((acc, achievement) => {
    const type = achievement.achievement_type || 'other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  // Calculate completion percentage
  const completionPercentage = Math.min(100, Math.round((totalPoints / maxPossiblePoints) * 100));

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-lg font-bold">
            <RiTrophyLine className="mr-2 h-5 w-5 text-yellow-500" />
            Achievements
          </CardTitle>
          <Badge variant="outline" className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
            {totalPoints} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        <div className="space-y-4">
          {Object.entries(groupedAchievements).map(([type, typeAchievements]) => (
            <div key={type} className="space-y-2">
              <h3 className="text-sm font-medium capitalize">{type} Achievements</h3>
              <div className="grid grid-cols-2 gap-2">
                {typeAchievements.map((achievement) => {
                  const isEarned = !!achievement.earned_at;
                  
                  // Get icon class from badge_icon_url or use a default
                  let iconClass = "ri-medal-line";
                  if (achievement.badge_icon_url) {
                    if (achievement.badge_icon_url.startsWith("ri-")) {
                      iconClass = achievement.badge_icon_url;
                    }
                  }
                  
                  return (
                    <div 
                      key={achievement.id} 
                      className={`p-3 rounded-md border flex items-start ${
                        isEarned 
                          ? "bg-green-50 border-green-200" 
                          : "bg-gray-50 border-gray-200 opacity-70"
                      }`}
                    >
                      <div className={`mr-2 mt-0.5 ${isEarned ? "text-green-600" : "text-gray-400"}`}>
                        <i className={`${iconClass} text-lg`}></i>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{achievement.name}</div>
                        <div className="text-xs text-muted-foreground">{achievement.description}</div>
                        {isEarned && (
                          <div className="text-xs text-green-600 mt-1 font-medium">
                            {achievement.points_awarded ? `+${achievement.points_awarded} pts` : ''} 
                            {achievement.earned_at && ` • Earned on ${new Date(achievement.earned_at).toLocaleDateString()}`}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}