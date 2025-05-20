import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RiDnaLine } from "react-icons/ri";

interface Skill {
  id: number;
  name: string;
  category: string; 
  rating: number;
  max_rating: number;
}

interface SkillDNAStrandCardProps {
  skills: Skill[];
  overallProgress: number;
}

// Categorize skills and assign colors
const categoryColors: Record<string, string> = {
  "Sales": "bg-blue-500",
  "Knowledge": "bg-emerald-500",
  "Relationship": "bg-purple-500",
  "Technical": "bg-amber-500",
  "Marketing": "bg-pink-500",
  "Soft Skills": "bg-indigo-500"
};

export default function SkillDNAStrandCard({ skills, overallProgress }: SkillDNAStrandCardProps) {
  // Group skills by category
  const skillsByCategory: Record<string, Skill[]> = {};
  skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill);
  });

  return (
    <Card className="col-span-full md:col-span-8 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <RiDnaLine className="mr-2 h-6 w-6 text-primary" />
          Your Skill DNA
        </CardTitle>
        <Badge variant="outline" className="ml-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          {overallProgress}% Growth
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center">
                <h3 className="text-sm font-medium flex-1">{category}</h3>
                <span className="text-sm text-muted-foreground">
                  {Math.round(categorySkills.reduce((sum, skill) => sum + (skill.rating / skill.max_rating * 100), 0) / categorySkills.length)}%
                </span>
              </div>
              <div className="space-y-2">
                {categorySkills.map(skill => (
                  <div key={skill.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{skill.name}</span>
                      <span>{skill.rating}/{skill.max_rating}</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full">
                      <div 
                        className={`absolute inset-0 ${categoryColors[category] || "bg-primary"} transition-all duration-300`} 
                        style={{ width: `${(skill.rating / skill.max_rating) * 100}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-4 border-t">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Overall Skills Growth</span>
            <span>{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}