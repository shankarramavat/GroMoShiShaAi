interface Interest {
  name: string;
}

interface Lead {
  id: number;
  name: string;
  phone_number: string;
  match_score: number;
  interests: Interest[];
  pitch_tip: string;
}

interface LeadCardProps {
  lead: Lead;
}

export default function LeadCard({ lead }: LeadCardProps) {
  // Function to make phone call
  const handleCall = () => {
    window.open(`tel:${lead.phone_number}`);
  };

  // Function to open WhatsApp
  const handleWhatsApp = () => {
    const phoneNumber = lead.phone_number.replace(/\s+/g, '');
    window.open(`https://wa.me/${phoneNumber}`);
  };

  // Function to view details
  const handleViewDetails = () => {
    // Implement view details functionality
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-neutral-800">{lead.name}</h3>
            <p className="text-sm text-neutral-500">{lead.phone_number}</p>
          </div>
          <div className="bg-primary bg-opacity-10 text-primary text-sm font-medium px-3 py-1 rounded-full">
            {lead.match_score}% Match
          </div>
        </div>
        
        <div className="mt-3">
          <p className="text-sm font-medium text-neutral-700">Interested in:</p>
          <div className="flex mt-1 flex-wrap">
            {lead.interests.map((interest, index) => (
              <span 
                key={index} 
                className="text-xs bg-neutral-100 text-neutral-800 px-2 py-1 rounded-full mr-2 mb-2"
              >
                {interest.name}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-3 bg-neutral-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-neutral-700">SHISHA's Pitch Tip:</p>
          <p className="text-sm text-neutral-600 mt-1">{lead.pitch_tip}</p>
        </div>
      </div>
      
      <div className="flex border-t border-neutral-100">
        <button 
          onClick={handleCall}
          className="flex-1 py-3 text-sm font-medium text-primary hover:bg-primary-light hover:bg-opacity-10 transition-colors flex justify-center items-center"
        >
          <i className="ri-phone-line mr-2"></i>
          Call
        </button>
        <div className="w-px bg-neutral-100"></div>
        <button 
          onClick={handleWhatsApp}
          className="flex-1 py-3 text-sm font-medium text-primary hover:bg-primary-light hover:bg-opacity-10 transition-colors flex justify-center items-center"
        >
          <i className="ri-whatsapp-line mr-2"></i>
          WhatsApp
        </button>
        <div className="w-px bg-neutral-100"></div>
        <button 
          onClick={handleViewDetails}
          className="flex-1 py-3 text-sm font-medium text-primary hover:bg-primary-light hover:bg-opacity-10 transition-colors flex justify-center items-center"
        >
          <i className="ri-file-list-3-line mr-2"></i>
          View Details
        </button>
      </div>
    </div>
  );
}
