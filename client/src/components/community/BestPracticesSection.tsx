import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  RiThumbUpLine, 
  RiMessage2Line,
  RiLightbulbLine
} from "react-icons/ri";

interface Partner {
  id: number;
  name: string;
  profile_image_url: string | null;
}

interface BestPractice {
  id: number;
  partner: Partner;
  content: string;
  likes_count: number | null;
  comments_count: number | null;
  created_at: Date | null;
}

interface BestPracticesSectionProps {
  bestPractices: BestPractice[];
}

export default function BestPracticesSection({ bestPractices }: BestPracticesSectionProps) {
  // Calculate how long ago the post was created
  const getTimeAgo = (date: Date | null) => {
    if (!date) return "Recently";
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays} days ago`;
    
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <RiLightbulbLine className="h-5 w-5 mr-2 text-amber-500" />
        <h2 className="text-xl font-bold">Best Practices</h2>
      </div>

      <div className="grid gap-4">
        {bestPractices.map((practice) => (
          <Card key={practice.id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={practice.partner.profile_image_url || ""} alt={practice.partner.name} />
                  <AvatarFallback>{practice.partner.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{practice.partner.name}</div>
                  <div className="text-xs text-muted-foreground">{getTimeAgo(practice.created_at)}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{practice.content}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <button className="flex items-center mr-4 hover:text-primary transition-colors">
                  <RiThumbUpLine className="h-4 w-4 mr-1" />
                  <span>{practice.likes_count || 0}</span>
                </button>
                <div className="flex items-center">
                  <RiMessage2Line className="h-4 w-4 mr-1" />
                  <span>{practice.comments_count || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}