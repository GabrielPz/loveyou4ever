import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCZzMo1ldTjvzyhWY9HuzSlMKhrRDAfuT4",
  authDomain: "loveyou4ever-3e32c.firebaseapp.com",
  projectId: "loveyou4ever-3e32c",
  storageBucket: "loveyou4ever-3e32c.firebasestorage.app",
  messagingSenderId: "80915370816",
  appId: "1:80915370816:web:4e3ba54a8f6f8d7a5ba0a5"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
