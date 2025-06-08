
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBiO6ibYUHPgcDTD3ycps_PTB8BQJiErTY",
  authDomain: "the-loom-f2e10.firebaseapp.com",
  projectId: "the-loom-f2e10",
  storageBucket: "the-loom-f2e10.appspot.com",
  messagingSenderId: "54331315583",
  appId: "1:54331315583:web:186ae891eff7f00111764a",
  measurementId: "G-FHHHG2R0PV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInBtn = document.getElementById("sign-in-btn");
const signOutBtn = document.getElementById("sign-out-btn");
const viewProfileBtn = document.getElementById("view-profile-btn");
const userInfo = document.getElementById("user-info");

if (signInBtn) {
  signInBtn.onclick = () => {
    signInWithPopup(auth, provider).catch(console.error);
  };
}

if (signOutBtn) {
  signOutBtn.onclick = () => {
    signOut(auth);
  };
}

onAuthStateChanged(auth, (user) => {
  if (user && userInfo) {
    userInfo.textContent = user.displayName || user.email;
    if (signInBtn) signInBtn.style.display = "none";
    if (signOutBtn) signOutBtn.style.display = "inline-block";
    if (viewProfileBtn) viewProfileBtn.style.display = "inline-block";
  }
});
