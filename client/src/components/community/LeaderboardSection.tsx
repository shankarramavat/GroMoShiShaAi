interface TopPerformer {
  id: number;
  name: string;
  sales_amount: number;
  profile_image_url: string;
  rank: number;
}

interface LeaderboardSectionProps {
  topPerformers: TopPerformer[];
}

export default function LeaderboardSection({ topPerformers }: LeaderboardSectionProps) {
  // Format the sales amount with the rupee symbol and commas
  const formatSalesAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount).replace('₹', '₹');
  };

  // Get the background color based on rank
  const getRankBackground = (rank: number) => {
    switch(rank) {
      case 1: return 'bg-primary';
      case 2: return 'bg-[#FF8A00]';
      case 3: return 'bg-[#00C2A8]';
      default: return 'bg-neutral-400';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-5 mb-6">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Top Performers This Month</h3>
      
      <div className="space-y-4">
        {topPerformers.map((performer) => (
          <div key={performer.id} className="flex items-center">
            <div className={`w-8 h-8 ${getRankBackground(performer.rank)} text-white rounded-full flex items-center justify-center font-medium text-sm`}>
              {performer.rank}
            </div>
            <div className="h-12 w-12 rounded-full bg-neutral-200 mx-3 overflow-hidden">
              <img 
                src={performer.profile_image_url} 
                alt={`${performer.name} avatar`} 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <p className="font-medium text-neutral-800">{performer.name}</p>
              <p className="text-sm text-neutral-500">{formatSalesAmount(performer.sales_amount)} in sales</p>
            </div>
            <button className="text-sm text-primary font-medium">Follow</button>
          </div>
        ))}
      </div>
    </div>
  );
}
