interface Skill {
  name: string;
  rating: number;
  max: number;
}

interface SkillDNACardProps {
  skills: Skill[];
  skillProgress: number;
}

export default function SkillDNACard({ skills, skillProgress }: SkillDNACardProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-card mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-neutral-800">Your Skill DNA</h3>
        <button className="text-primary text-sm font-medium">View Details</button>
      </div>
      
      <div className="dna-strand relative h-[120px] w-full flex items-center justify-between px-[10px]">
        <div className="dna-connector absolute h-[4px] bg-[#DEE2E6] w-[calc(100%-90px)] top-[60px] left-[45px] z-0"></div>
        <div className="dna-node-progress absolute h-[4px] bg-primary w-[65%] top-[60px] left-[45px] z-0" style={{ width: `${skillProgress}%` }}></div>
        
        <div className="dna-node active w-[36px] h-[36px] rounded-full bg-primary border-2 border-primary flex items-center justify-center z-[1] text-white font-semibold relative">
          <i className="ri-chat-1-line text-sm"></i>
        </div>
        
        <div className="dna-node active w-[36px] h-[36px] rounded-full bg-primary border-2 border-primary flex items-center justify-center z-[1] text-white font-semibold relative">
          <i className="ri-book-read-line text-sm"></i>
        </div>
        
        <div className="dna-node active w-[36px] h-[36px] rounded-full bg-primary border-2 border-primary flex items-center justify-center z-[1] text-white font-semibold relative">
          <i className="ri-user-heart-line text-sm"></i>
        </div>
        
        <div className="dna-node w-[36px] h-[36px] rounded-full bg-[#F8F9FA] border-2 border-primary flex items-center justify-center z-[1] text-primary font-semibold relative">
          <i className="ri-bank-line text-sm"></i>
        </div>
        
        <div className="dna-node w-[36px] h-[36px] rounded-full bg-[#F8F9FA] border-2 border-primary flex items-center justify-center z-[1] text-primary font-semibold relative">
          <i className="ri-team-line text-sm"></i>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {skills.map((skill, index) => (
          <div key={index} className="skill-item">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-neutral-700">{skill.name}</p>
              <p className="text-sm font-medium text-neutral-600">{skill.rating}/{skill.max}</p>
            </div>
            <div className="skill-bar h-[6px] w-full bg-[#DEE2E6] rounded-[6px] overflow-hidden">
              <div 
                className="skill-progress h-full bg-primary rounded-[6px]" 
                style={{ width: `${(skill.rating / skill.max) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
