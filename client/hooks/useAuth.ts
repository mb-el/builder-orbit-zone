import { useState, useEffect, createContext, useContext } from "react";
import { auth } from "@/lib/firebase";
import {
  User,
  onAuthStateChanged,
  signInAnonymously,
  signOut as firebaseSignOut,
} from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInAnonymous: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInAnonymous: async () => {},
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInAnonymous = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Anonymous sign-in failed:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signInAnonymous,
    signOut,
  };
};

// Mock user data for development (when no authentication is set up)
export const getMockUser = () => ({
  uid: "demo-user-123",
  displayName: "John Doe",
  email: "john.doe@example.com",
  photoURL: "/placeholder.svg",
});

// Get current user data (real or mock)
export const getCurrentUser = (user: User | null) => {
  if (user) {
    return {
      authorId: user.uid,
      authorName: user.displayName || "Anonymous User",
      authorAvatar: user.photoURL || "/placeholder.svg",
    };
  }

  // Return mock data for development
  const mockUser = getMockUser();
  return {
    authorId: mockUser.uid,
    authorName: mockUser.displayName,
    authorAvatar: mockUser.photoURL,
  };
};
