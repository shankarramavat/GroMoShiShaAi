import { useLocation } from "wouter";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between">
          <button 
            className={`flex flex-col items-center py-3 px-4 ${isActive('/') ? 'text-primary active relative' : 'text-neutral-600'}`}
            onClick={() => setLocation("/")}
          >
            <i className="ri-dashboard-line text-xl"></i>
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          
          <button 
            className={`flex flex-col items-center py-3 px-4 ${isActive('/leads') ? 'text-primary active relative' : 'text-neutral-600'}`}
            onClick={() => setLocation("/leads")}
          >
            <i className="ri-user-search-line text-xl"></i>
            <span className="text-xs mt-1">Leads</span>
          </button>
          
          <button 
            className={`flex flex-col items-center py-3 px-4 ${isActive('/ai-coach') ? 'text-primary active relative' : 'text-neutral-600'}`}
            onClick={() => setLocation("/ai-coach")}
          >
            <i className="ri-robot-line text-xl"></i>
            <span className="text-xs mt-1">AI Coach</span>
          </button>
          
          <button 
            className={`flex flex-col items-center py-3 px-4 ${isActive('/community') ? 'text-primary active relative' : 'text-neutral-600'}`}
            onClick={() => setLocation("/community")}
          >
            <i className="ri-team-line text-xl"></i>
            <span className="text-xs mt-1">Community</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
