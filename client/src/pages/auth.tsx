import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { RecaptchaVerifier, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthMode = "login" | "signup";
type AuthMethod = "email" | "phone";
type VerificationStep = "input" | "verify";

export default function Auth() {
  // Basic state
  const [mode, setMode] = useState<AuthMode>("login");
  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");
  const [step, setStep] = useState<VerificationStep>("input");
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  
  // Loading and verification states
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  // References
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  
  // Hooks
  const { login, loginWithGoogle, loginWithPhone, confirmPhoneCode, signup, signupWithPhone } = useAuth();
  const { toast } = useToast();
  
  // Initialize recaptcha when needed
  useEffect(() => {
    if (authMethod === 'phone' && step === 'input') {
      // Clean up previous instance if it exists
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
      
      if (recaptchaContainerRef.current && !recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
          size: 'normal',
          callback: () => {
            // reCAPTCHA solved, allow the user to continue
            console.log("reCAPTCHA verified");
          },
          'expired-callback': () => {
            toast({
              variant: "destructive",
              title: "reCAPTCHA expired",
              description: "Please solve the reCAPTCHA again.",
            });
          }
        });
        
        recaptchaVerifierRef.current.render();
      }
    }
    
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, [authMethod, step, toast]);

  // Helper function to format phone number
  const formatPhoneNumber = (phoneNumber: string) => {
    // Remove any non-digit characters
    const digits = phoneNumber.replace(/\D/g, '');
    
    // Check if it has country code
    if (!phoneNumber.startsWith('+')) {
      // Default to India's country code
      return `+91${digits}`;
    }
    
    return phoneNumber;
  };

  // Email login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Logged in successfully",
        description: "Welcome to SHISHA AI Partner",
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

  // Phone login - Step 1: Send verification code
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!recaptchaVerifierRef.current) {
        throw new Error("reCAPTCHA not initialized");
      }
      
      const formattedPhone = formatPhoneNumber(phone);
      const result = await loginWithPhone(formattedPhone, recaptchaVerifierRef.current);
      setConfirmationResult(result);
      setStep("verify");
      
      toast({
        title: "Verification code sent",
        description: "Please enter the code sent to your phone",
      });
    } catch (error: any) {
      toast({
        title: "Phone login failed",
        description: error?.message || "Could not send verification code. Please try again.",
        variant: "destructive",
      });
      // Reset reCAPTCHA on error
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Phone verification - Step 2: Verify code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!confirmationResult) {
        throw new Error("No verification in progress");
      }
      
      await confirmPhoneCode(confirmationResult, verificationCode);
      
      // For signup, also update the name
      if (mode === "signup") {
        await signupWithPhone(name, null); // No need for credential here, already authenticated
      }
      
      toast({
        title: mode === "login" ? "Login successful" : "Account created successfully",
        description: "Welcome to SHISHA AI Partner",
      });
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error?.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Email/password signup
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signup(email, password, name, phone);
      toast({
        title: "Account created successfully",
        description: "Welcome to SHISHA AI Partner",
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

  // Phone signup - Same as phone login for first step
  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!recaptchaVerifierRef.current) {
        throw new Error("reCAPTCHA not initialized");
      }
      
      const formattedPhone = formatPhoneNumber(phone);
      const result = await loginWithPhone(formattedPhone, recaptchaVerifierRef.current);
      setConfirmationResult(result);
      setStep("verify");
      
      toast({
        title: "Verification code sent",
        description: "Please enter the code sent to your phone to complete signup",
      });
    } catch (error: any) {
      toast({
        title: "Phone verification failed",
        description: error?.message || "Could not send verification code. Please try again.",
        variant: "destructive",
      });
      // Reset reCAPTCHA on error
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google login/signup
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      await loginWithGoogle();
      toast({
        title: "Logged in successfully",
        description: "Welcome to SHISHA AI Partner",
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

  // Mode and method toggles
  // Handle form submission based on current mode and method
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "login") {
      if (authMethod === "email") {
        handleEmailLogin(e);
      } else if (step === "input") {
        handlePhoneLogin(e);
      } else {
        handleVerifyCode(e);
      }
    } else { // signup
      if (authMethod === "email") {
        handleEmailSignup(e);
      } else if (step === "input") {
        handlePhoneSignup(e);
      } else {
        handleVerifyCode(e);
      }
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setAuthMethod("email");
    setStep("input");
    setConfirmationResult(null);
    setVerificationCode("");
  };
  
  const toggleAuthMethod = () => {
    setAuthMethod(authMethod === "email" ? "phone" : "email");
    setStep("input");
    setConfirmationResult(null);
    setVerificationCode("");
  };
  
  // Go back to input step
  const goBack = () => {
    setStep("input");
    setConfirmationResult(null);
    setVerificationCode("");
    
    // Reset reCAPTCHA
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
      recaptchaVerifierRef.current = null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className="h-16 w-16 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <i className="ri-seedling-line text-white text-3xl"></i>
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-neutral-800 tracking-tight">GroMo</h1>
              <p className="text-sm font-medium text-primary">AI Partner SHISHA</p>
            </div>
          </div>
        </div>
        
        {/* Auth Form */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-neutral-100">
          <h2 className="text-2xl font-bold text-neutral-800 mb-3">
            {mode === "login" ? "Welcome back!" : "Join GroMo SHISHA"}
          </h2>
          <p className="text-neutral-500 mb-6 text-sm">
            {mode === "login" 
              ? "Sign in to access your partner dashboard" 
              : "Create your account to get started as a GroMo Partner"}
          </p>
          
          {/* Auth Method Tabs */}
          <div className="flex mb-6 bg-neutral-50 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setAuthMethod("email")}
              className={`flex-1 text-center py-2.5 px-4 rounded-md transition-all duration-200 flex items-center justify-center ${
                authMethod === "email"
                  ? "bg-white text-primary font-medium shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <i className="ri-mail-line mr-2 text-lg"></i> Email
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod("phone")}
              className={`flex-1 text-center py-2.5 px-4 rounded-md transition-all duration-200 flex items-center justify-center ${
                authMethod === "phone"
                  ? "bg-white text-primary font-medium shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <i className="ri-phone-line mr-2 text-lg"></i> Phone
            </button>
          </div>
          
          {/* Login Forms */}
          {mode === "login" && (
            <>
              {authMethod === "email" ? (
                // Email Login Form
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-600 mb-1" htmlFor="email">
                      Email
                    </label>
                    <div className="relative">
                      <i className="ri-mail-line absolute left-3 top-3.5 text-neutral-400"></i>
                      <input
                        id="email"
                        type="email"
                        className="w-full px-4 py-3.5 pl-10 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm transition-all duration-200"
                        placeholder="partner@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-600 mb-1" htmlFor="password">
                      Password
                    </label>
                    <div className="relative">
                      <i className="ri-lock-line absolute left-3 top-3.5 text-neutral-400"></i>
                      <input
                        id="password"
                        type="password"
                        className="w-full px-4 py-3.5 pl-10 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm transition-all duration-200"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex justify-end mt-1">
                      <a href="#" className="text-sm text-primary font-medium">Forgot password?</a>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 shadow-md"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                      </span>
                    ) : (
                      "Log In"
                    )}
                  </button>
                </form>
              ) : step === "input" ? (
                // Phone Login - Step 1: Phone Number Input
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-600 mb-1" htmlFor="phone">
                      Phone Number
                    </label>
                    <div className="relative">
                      <i className="ri-phone-line absolute left-3 top-3.5 text-neutral-400"></i>
                      <input
                        id="phone"
                        type="tel"
                        className="w-full px-4 py-3 pl-10 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="+91 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  {/* reCAPTCHA container */}
                  <div className="mb-6">
                    <div ref={recaptchaContainerRef} className="flex justify-center"></div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 shadow-md"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending code...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <i className="ri-message-3-line mr-2"></i>
                        Send Verification Code
                      </span>
                    )}
                  </button>
                </form>
              ) : (
                // Phone Login - Step 2: Verification Code
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-600 mb-1" htmlFor="verification-code">
                      Verification Code
                    </label>
                    <div className="relative">
                      <i className="ri-shield-check-line absolute left-3 top-3.5 text-neutral-400"></i>
                      <input
                        id="verification-code"
                        type="text"
                        className="w-full px-4 py-3 pl-10 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">
                      A verification code has been sent to {phone}
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={goBack}
                      className="flex-1 border border-neutral-300 bg-white text-neutral-800 font-medium py-3 rounded-lg transition-colors duration-200 disabled:opacity-70"
                      disabled={isLoading}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-[#5935C8] text-white font-medium py-3 rounded-lg transition-colors duration-200 disabled:opacity-70"
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Verify & Login"}
                    </button>
                  </div>
                </form>
              )}
              
              {/* Social Login and Sign Up Link */}
              {(authMethod === "email" || step === "input") && (
                <>
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
                </>
              )}
              
              <div className="mt-4 text-center">
                <p className="text-neutral-600 text-sm">
                  Don't have an account? <button type="button" onClick={toggleMode} className="text-primary font-medium">Register</button>
                </p>
              </div>
            </>
          )}
          
          {/* Sign Up Forms */}
          {mode === "signup" && (
            <>
              {step === "input" ? (
                // Sign Up - Step 1: User Details
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-600 mb-1" htmlFor="name">
                      Full Name
                    </label>
                    <div className="relative">
                      <i className="ri-user-line absolute left-3 top-3.5 text-neutral-400"></i>
                      <input
                        id="name"
                        type="text"
                        className="w-full px-4 py-3 pl-10 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  {authMethod === "email" ? (
                    // Email-specific fields
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-neutral-600 mb-1" htmlFor="email">
                          Email
                        </label>
                        <div className="relative">
                          <i className="ri-mail-line absolute left-3 top-3.5 text-neutral-400"></i>
                          <input
                            id="email"
                            type="email"
                            className="w-full px-4 py-3 pl-10 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="partner@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-neutral-600 mb-1" htmlFor="password">
                          Password
                        </label>
                        <div className="relative">
                          <i className="ri-lock-line absolute left-3 top-3.5 text-neutral-400"></i>
                          <input
                            id="password"
                            type="password"
                            className="w-full px-4 py-3 pl-10 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </>
                  ) : null}
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-600 mb-1" htmlFor="phone">
                      Phone Number
                    </label>
                    <div className="relative">
                      <i className="ri-phone-line absolute left-3 top-3.5 text-neutral-400"></i>
                      <input
                        id="phone"
                        type="tel"
                        className="w-full px-4 py-3 pl-10 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="+91 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  {/* reCAPTCHA container for phone verification */}
                  {authMethod === "phone" && (
                    <div className="mb-4">
                      <div ref={recaptchaContainerRef} className="flex justify-center"></div>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-[#5935C8] text-white font-medium py-3 rounded-lg transition-colors duration-200 disabled:opacity-70"
                    disabled={isLoading}
                  >
                    {isLoading 
                      ? "Processing..." 
                      : authMethod === "email" 
                        ? "Create Account" 
                        : "Send Verification Code"
                    }
                  </button>
                  
                  {/* Social Sign Up */}
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
                </form>
              ) : (
                // Sign Up - Step 2: Verify Phone Code
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-600 mb-1" htmlFor="verification-code">
                      Verification Code
                    </label>
                    <div className="relative">
                      <i className="ri-shield-check-line absolute left-3 top-3.5 text-neutral-400"></i>
                      <input
                        id="verification-code"
                        type="text"
                        className="w-full px-4 py-3 pl-10 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">
                      A verification code has been sent to {phone}
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={goBack}
                      className="flex-1 border border-neutral-300 bg-white text-neutral-800 font-medium py-3 rounded-lg transition-colors duration-200 disabled:opacity-70"
                      disabled={isLoading}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-[#5935C8] text-white font-medium py-3 rounded-lg transition-colors duration-200 disabled:opacity-70"
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Complete Sign Up"}
                    </button>
                  </div>
                </form>
              )}
              
              <div className="mt-4 text-center">
                <p className="text-neutral-600 text-sm">
                  Already have an account? <button type="button" onClick={toggleMode} className="text-primary font-medium">Login</button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
