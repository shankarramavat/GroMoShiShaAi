import { useAuth } from "@/context/AuthContext";

export default function AppHeader() {
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
            <i className="ri-seedling-line text-white text-xl"></i>
          </div>
          <h1 className="ml-2 text-lg font-bold text-neutral-800">GroMo Partner</h1>
        </div>
        
        <div className="flex items-center">
          <button className="mr-3 relative">
            <i className="ri-notification-3-line text-neutral-600 text-xl"></i>
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-error rounded-full flex items-center justify-center text-white text-xs">3</span>
          </button>
          <button>
            <div className="h-10 w-10 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center">
              {user?.profile_image_url ? (
                <img 
                  src={user.profile_image_url} 
                  alt="Profile avatar" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <i className="ri-user-line text-neutral-500"></i>
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
