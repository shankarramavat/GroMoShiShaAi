import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Logged in successfully",
        description: "Welcome to GroMo AI Partner",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className="h-16 w-16 bg-primary rounded-xl flex items-center justify-center">
              <i className="ri-seedling-line text-white text-3xl"></i>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-neutral-800">GroMo</h1>
              <p className="text-sm text-neutral-500">AI Partner SHISHA</p>
            </div>
          </div>
        </div>
        
        {/* Login Form */}
        <div className="bg-white rounded-xl p-6 shadow-card">
          <h2 className="text-xl font-semibold text-neutral-800 mb-6">Login to your account</h2>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-600 mb-1" htmlFor="email">
                Phone Number or Email
              </label>
              <input
                id="email"
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="+91 9876543210"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-600 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-end mt-1">
                <a href="#" className="text-sm text-primary font-medium">Forgot password?</a>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary hover:bg-[#5935C8] text-white font-medium py-3 rounded-lg transition-colors duration-200 disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-neutral-600 text-sm">
              Don't have an account? <a href="#" className="text-primary font-medium">Register</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
