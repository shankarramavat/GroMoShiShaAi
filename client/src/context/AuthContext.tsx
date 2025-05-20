import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  User as FirebaseUser, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider, phoneProvider } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";

// Define our user interface
interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  profile_image_url: string;
  firebaseUid: string;
  location?: string;
  bio?: string;
  earnings_this_month?: number;
  total_sales_value?: number;
}

// Context type
interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithPhone: (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
  confirmPhoneCode: (confirmationResult: ConfirmationResult, code: string) => Promise<void>;
  signup: (email: string, password: string, name: string, phone: string) => Promise<void>;
  signupWithPhone: (name: string, phoneCredential: any) => Promise<void>;
  logout: () => Promise<void>;
}

// Create a default context value
const defaultContextValue: AuthContextType = {
  user: null,
  firebaseUser: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  loginWithGoogle: async () => {},
  loginWithPhone: async () => { throw new Error("Not implemented"); },
  confirmPhoneCode: async () => { throw new Error("Not implemented"); },
  signup: async () => {},
  signupWithPhone: async () => {},
  logout: async () => {},
};

// Create the context with default value
const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      
      if (fbUser) {
        try {
          // For development purposes, mock the user data
          // In production, we would fetch from backend
          setUser({
            id: 1,
            name: fbUser.displayName || "Partner",
            email: fbUser.email || "",
            phone_number: fbUser.phoneNumber || "",
            profile_image_url: fbUser.photoURL || "",
            firebaseUid: fbUser.uid
          });
        } catch (error) {
          console.error("Failed to load user", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Login with email/password
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener will handle setting the user
    } catch (error) {
      console.error("Login failed", error);
      setIsLoading(false);
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // The onAuthStateChanged listener will handle setting the user
    } catch (error) {
      console.error("Google login failed", error);
      setIsLoading(false);
      throw error;
    }
  };

  // Sign up with email/password
  const signup = async (email: string, password: string, name: string, phone: string) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      
      // In development, we'll mock the user creation
      setUser({
        id: 1,
        name: name,
        email: email,
        phone_number: phone,
        profile_image_url: "",
        firebaseUid: fbUser.uid
      });
      
    } catch (error) {
      console.error("Signup failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Log out
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Phone authentication implementation
  const loginWithPhone = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
    setIsLoading(true);
    try {
      return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    } catch (error) {
      console.error("Phone login failed", error);
      setIsLoading(false);
      throw error;
    }
  };

  // Confirm phone code after login/signup with phone
  const confirmPhoneCode = async (confirmationResult: ConfirmationResult, code: string): Promise<void> => {
    setIsLoading(true);
    try {
      const userCredential = await confirmationResult.confirm(code);
      const fbUser = userCredential.user;
      
      // In development, we'll mock the user data
      setUser({
        id: 1,
        name: fbUser.displayName || "Partner",
        email: fbUser.email || "",
        phone_number: fbUser.phoneNumber || "",
        profile_image_url: fbUser.photoURL || "",
        firebaseUid: fbUser.uid
      });
    } catch (error) {
      console.error("Phone code confirmation failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with phone (after phone verification)
  const signupWithPhone = async (name: string, phoneCredential: any): Promise<void> => {
    setIsLoading(true);
    try {
      const fbUser = auth.currentUser;
      
      if (fbUser) {
        // Update profile with name
        await updateProfile(fbUser, {
          displayName: name
        });
        
        // In development, we'll mock the user creation
        setUser({
          id: 1,
          name: name,
          email: fbUser.email || "",
          phone_number: fbUser.phoneNumber || "",
          profile_image_url: fbUser.photoURL || "",
          firebaseUid: fbUser.uid
        });
      } else {
        throw new Error("No user is currently signed in");
      }
    } catch (error) {
      console.error("Phone signup failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create the context value
  const value = {
    user,
    firebaseUser,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithGoogle,
    loginWithPhone,
    confirmPhoneCode,
    signup,
    signupWithPhone,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
