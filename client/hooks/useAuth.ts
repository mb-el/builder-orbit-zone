import { useState, useEffect, createContext, useContext } from "react";
import { auth, areFirebaseServicesAvailable } from "@/lib/firebase";
import {
  User,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInAnonymous: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInAnonymous: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => ({}) as User,
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
    // Check if Firebase services are available
    if (!areFirebaseServicesAvailable() || !auth) {
      console.warn(
        "Firebase not properly configured, using mock authentication",
      );
      // For development, create a mock user to prevent blocking the app
      const mockUser = {
        uid: "demo-user-123",
        email: "demo@example.com",
        displayName: "Demo User",
        photoURL: "/placeholder.svg",
        emailVerified: false,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: "",
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => "demo-token",
        getIdTokenResult: async () => ({}) as any,
        reload: async () => {},
        toJSON: () => ({}),
      } as User;

      setUser(mockUser);
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInAnonymous = async () => {
    if (!auth || !areFirebaseServicesAvailable()) {
      console.warn("Firebase not available, skipping anonymous sign-in");
      return;
    }

    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Anonymous sign-in failed:", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth || !areFirebaseServicesAvailable()) {
      // For development without Firebase, simulate successful login
      console.warn("Firebase not available, simulating login");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Email sign-in failed:", error);
      // Check for network errors and provide better error messages
      if (error.code === "auth/network-request-failed") {
        throw new Error(
          "Network connection failed. Please check your internet connection and Firebase configuration.",
        );
      }
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!auth || !areFirebaseServicesAvailable()) {
      // For development without Firebase, simulate successful signup
      console.warn("Firebase not available, simulating signup");
      return {
        uid: "demo-user-" + Date.now(),
        email,
        displayName: null,
        photoURL: null,
      } as User;
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return result.user;
    } catch (error) {
      console.error("Email sign-up failed:", error);
      // Check for network errors and provide better error messages
      if (error.code === "auth/network-request-failed") {
        throw new Error(
          "Network connection failed. Please check your internet connection and Firebase configuration.",
        );
      }
      throw error;
    }
  };

  const signOut = async () => {
    if (!auth || !areFirebaseServicesAvailable()) {
      console.warn("Firebase not available, simulating sign out");
      return;
    }

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
    signInWithEmail,
    signUpWithEmail,
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
