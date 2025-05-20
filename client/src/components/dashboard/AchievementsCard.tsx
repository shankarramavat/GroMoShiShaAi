interface Achievement {
  id: number;
  name: string;
  date: string;
  icon: string;
  completed: boolean;
}

interface AchievementsCardProps {
  achievements: Achievement[];
}

export default function AchievementsCard({ achievements }: AchievementsCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-card mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-neutral-800">Your Achievements</h3>
        <button className="text-primary text-sm font-medium">View All</button>
      </div>
      
      <div className="flex overflow-x-auto pb-2 -mx-2">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="flex-shrink-0 w-32 px-2">
            <div className="bg-neutral-50 rounded-lg p-3 flex flex-col items-center">
              <div className={`h-14 w-14 rounded-full ${
                achievement.completed 
                  ? 'bg-primary bg-opacity-10 text-primary' 
                  : 'bg-neutral-300 text-neutral-500'
              } flex items-center justify-center mb-2`}>
                <i className={`${achievement.icon} text-xl`}></i>
              </div>
              <p className={`text-sm font-medium ${
                achievement.completed ? 'text-neutral-700' : 'text-neutral-400'
              } text-center`}>
                {achievement.name}
              </p>
              <p className={`text-xs ${
                achievement.completed ? 'text-neutral-500' : 'text-neutral-400'
              } mt-1`}>
                {achievement.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
