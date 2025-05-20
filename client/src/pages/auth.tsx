import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { RecaptchaVerifier, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthMode = "login" | "signup";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle, signup } = useAuth();
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
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      await loginWithGoogle();
      toast({
        title: "Logged in successfully",
        description: "Welcome to GroMo AI Partner",
      });
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error?.message || "Could not login with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signup(email, password, name, phone);
      toast({
        title: "Account created successfully",
        description: "Welcome to GroMo AI Partner",
      });
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error?.message || "Could not create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
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
        
        {/* Auth Form */}
        <div className="bg-white rounded-xl p-6 shadow-card">
          <h2 className="text-xl font-semibold text-neutral-800 mb-6">
            {mode === "login" ? "Login to your account" : "Create a new account"}
          </h2>
          
          {mode === "login" ? (
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-600 mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="partner@example.com"
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
              
              <div className="mt-4 relative flex items-center justify-center">
                <hr className="w-full border-t border-neutral-200" />
                <span className="bg-white px-2 text-sm text-neutral-500 absolute">or</span>
              </div>
              
              <button
                type="button"
                className="w-full mt-4 border border-neutral-300 bg-white text-neutral-800 font-medium py-3 rounded-lg flex items-center justify-center hover:bg-neutral-50 transition-colors duration-200 disabled:opacity-70"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" className="mr-2">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                  <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                </svg>
                Continue with Google
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-neutral-600 text-sm">
                  Don't have an account? <button onClick={toggleMode} className="text-primary font-medium">Register</button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-600 mb-1" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-600 mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="partner@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-600 mb-1" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary hover:bg-[#5935C8] text-white font-medium py-3 rounded-lg transition-colors duration-200 disabled:opacity-70"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-neutral-600 text-sm">
                  Already have an account? <button onClick={toggleMode} className="text-primary font-medium">Login</button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
