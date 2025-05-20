interface Author {
  name: string;
  profile_image_url: string;
}

interface BestPractice {
  id: number;
  author: Author;
  content: string;
  likes: number;
  comments: number;
  days_ago: number;
}

interface BestPracticesSectionProps {
  bestPractices: BestPractice[];
}

export default function BestPracticesSection({ bestPractices }: BestPracticesSectionProps) {
  const handleLike = (practiceId: number) => {
    // Implement like functionality
  };

  const handleComment = (practiceId: number) => {
    // Implement comment functionality
  };

  const handleSave = (practiceId: number) => {
    // Implement save functionality
  };

  const handleSharePractice = () => {
    // Implement share practice functionality
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-5">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Best Practices</h3>
      
      <div className="space-y-4">
        {bestPractices.map((practice) => (
          <div key={practice.id} className="border border-neutral-100 rounded-lg p-4">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-neutral-200 overflow-hidden flex-shrink-0">
                <img 
                  src={practice.author.profile_image_url} 
                  alt={`${practice.author.name} avatar`} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="ml-3 flex-grow">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-neutral-800">{practice.author.name}</p>
                  <p className="text-xs text-neutral-500">{practice.days_ago} days ago</p>
                </div>
                <p className="text-sm text-neutral-600 mt-2">{practice.content}</p>
                <div className="mt-3 flex items-center">
                  <button 
                    className="flex items-center text-neutral-500 hover:text-primary text-sm"
                    onClick={() => handleLike(practice.id)}
                  >
                    <i className="ri-thumb-up-line mr-1"></i>
                    <span>{practice.likes}</span>
                  </button>
                  <button 
                    className="flex items-center text-neutral-500 hover:text-primary text-sm ml-4"
                    onClick={() => handleComment(practice.id)}
                  >
                    <i className="ri-chat-1-line mr-1"></i>
                    <span>{practice.comments}</span>
                  </button>
                  <button 
                    className="ml-auto text-primary text-sm font-medium"
                    onClick={() => handleSave(practice.id)}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className="w-full mt-4 py-3 text-primary font-medium text-sm border border-primary rounded-lg hover:bg-primary hover:bg-opacity-5 transition-colors"
        onClick={handleSharePractice}
      >
        Share Your Best Practice
      </button>
    </div>
  );
}
