interface WelcomeCardProps {
  name: string;
  earningsThisMonth: number;
  earningsChangePercent: number;
  totalLeads: number;
  hotLeadsCount: number;
}

export default function WelcomeCard({
  name,
  earningsThisMonth,
  earningsChangePercent,
  totalLeads,
  hotLeadsCount
}: WelcomeCardProps) {
  // Format the earnings with the rupee symbol and commas
  const formattedEarnings = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(earningsThisMonth).replace('₹', '₹');
  
  return (
    <div className="bg-white rounded-xl p-5 shadow-card mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-neutral-800">Welcome back, {name}!</h2>
          <p className="text-neutral-500 mt-1">Ready to grow your business today?</p>
        </div>
        <div className="bg-primary bg-opacity-10 rounded-lg p-2">
          <i className="ri-line-chart-line text-primary text-xl"></i>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-neutral-500 text-sm">Earnings (This Month)</p>
          <p className="text-xl font-bold text-neutral-800 mt-1">{formattedEarnings}</p>
          <div className={`flex items-center mt-1 ${earningsChangePercent >= 0 ? 'text-success' : 'text-error'} text-sm`}>
            <i className={earningsChangePercent >= 0 ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}></i>
            <span>{Math.abs(earningsChangePercent)}% vs last month</span>
          </div>
        </div>
        
        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-neutral-500 text-sm">Total Leads</p>
          <p className="text-xl font-bold text-neutral-800 mt-1">{totalLeads}</p>
          <div className="flex items-center mt-1 text-primary text-sm">
            <span>{hotLeadsCount} hot leads</span>
            <i className="ri-fire-line ml-1"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
