import { initializeApp } from "firebase/app";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Check if Firebase config is provided via environment variables
const hasFirebaseConfig =
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID;

// Firebase configuration - use environment variables if available, otherwise use demo project
const firebaseConfig = hasFirebaseConfig
  ? {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    }
  : {
      // Demo configuration for development
      apiKey: "demo-api-key",
      authDomain: "demo-project.firebaseapp.com",
      projectId: "demo-project",
      storageBucket: "demo-project.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:demo",
    };

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.warn("Firebase initialization failed, using mock services:", error);
  // Create a minimal app object for development
  app = null;
}

// Initialize Firebase services with fallback
let storage, db, auth;

if (app && hasFirebaseConfig) {
  // Production/development with real Firebase
  storage = getStorage(app);
  db = getFirestore(app);
  auth = getAuth(app);
} else {
  // Development mode with emulators or mocks
  try {
    const demoApp = initializeApp({
      projectId: "demo-project",
      apiKey: "demo-key",
      authDomain: "demo-project.firebaseapp.com",
    });

    auth = getAuth(demoApp);
    db = getFirestore(demoApp);
    storage = getStorage(demoApp);

    // Connect to emulators if running locally
    if (window.location.hostname === "localhost") {
      try {
        connectAuthEmulator(auth, "http://localhost:9099");
        connectFirestoreEmulator(db, "localhost", 8080);
        connectStorageEmulator(storage, "localhost", 9199);
      } catch (emulatorError) {
        console.log("Firebase emulators not available, using online mode");
      }
    }
  } catch (error) {
    console.warn("Failed to initialize Firebase demo project:", error);
    // Create mock objects to prevent app crashes
    auth = null;
    db = null;
    storage = null;
  }
}

export { storage, db, auth };
export default app;

// Export a flag to check if Firebase is properly configured
export const isFirebaseConfigured = !!app && hasFirebaseConfig;

// Export helper for checking if services are available
export const areFirebaseServicesAvailable = () => {
  return !!(auth && db && storage);
};

// Development warning
if (!hasFirebaseConfig && typeof window !== "undefined") {
  console.warn(
    "\n🔥 Firebase Configuration Missing!\n\nTo set up Firebase:\n1. Create a Firebase project at https://console.firebase.google.com\n2. Enable Authentication, Firestore, and Storage\n3. Add your config to environment variables or update firebase.ts\n\nUsing demo mode for now...",
  );
}
