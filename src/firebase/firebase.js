import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore"; // أضف serverTimestamp
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDIPpMgxNW559EMYSalX4e-_mkvYm60Hmk",
  authDomain: "form-skillbridge.firebaseapp.com",
  projectId: "form-skillbridge",
  storageBucket: "form-skillbridge.appspot.com",
  messagingSenderId: "185153100592",
  appId: "1:185153100592:web:cbbefd38ed431abeb686f5",
  measurementId: "G-ZT6Z3V0NJ9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db, analytics, serverTimestamp }; // أضف serverTimestamp للتصدير