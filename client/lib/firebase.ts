// client/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// إعدادات مشروع Firebase
const firebaseConfig = {
  apiKey: "ضع هنا API KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// تصدير وحدة المصادقة
export const auth = getAuth(app);
