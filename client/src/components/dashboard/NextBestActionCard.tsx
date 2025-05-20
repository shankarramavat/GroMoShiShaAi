interface NextBestAction {
  title: string;
  description: string;
  actionText: string;
}

interface NextBestActionCardProps {
  action: NextBestAction;
}

export default function NextBestActionCard({ action }: NextBestActionCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-card mb-6">
      <h3 className="text-lg font-semibold text-neutral-800 mb-3">Next Best Action</h3>
      
      <div className="bg-[#00C2A8] bg-opacity-10 rounded-lg p-4 flex items-start">
        <div className="bg-[#00C2A8] rounded-full p-2 mr-3 flex-shrink-0">
          <i className="ri-customer-service-2-line text-white"></i>
        </div>
        <div>
          <h4 className="font-medium text-neutral-800">{action.title}</h4>
          <p className="text-sm text-neutral-600 mt-1">{action.description}</p>
          <button className="mt-3 bg-[#00C2A8] text-white font-medium px-4 py-2 rounded-lg text-sm">
            {action.actionText}
          </button>
        </div>
      </div>
    </div>
  );
}
