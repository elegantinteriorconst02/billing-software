import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAJliCUJkElsPwbJUGrTUmB7EPyiGaCniQ",
  authDomain: "eic-billing-software-55635.firebaseapp.com",
  projectId: "eic-billing-software-55635",
  storageBucket: "eic-billing-software-55635.appspot.com",
  messagingSenderId: "376103136888",
  appId: "1:376103136888:web:ae1ab4d7195037a529478d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
