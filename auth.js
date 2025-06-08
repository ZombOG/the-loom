
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBiO6ibYUHPgcDTD3ycps_PTB8BQJiErTY",
  authDomain: "the-loom-f2e10.firebaseapp.com",
  projectId: "the-loom-f2e10",
  storageBucket: "the-loom-f2e10.firebasestorage.app",
  messagingSenderId: "54331315583",
  appId: "1:54331315583:web:186ae891eff7f00111764a",
  measurementId: "G-FHHHG2R0PV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInBtn = document.getElementById("sign-in-btn");
const signOutBtn = document.getElementById("sign-out-btn");
const profileBtn = document.getElementById("view-profile-btn");
const userInfo = document.getElementById("user-info");

signInBtn.onclick = () => {
  signInWithPopup(auth, provider)
    .then(result => {
      const user = result.user;
      userInfo.textContent = "Welcome, " + user.displayName;
    }).catch(console.error);
};

signOutBtn.onclick = () => {
  signOut(auth).then(() => {
    userInfo.textContent = "";
  });
};

onAuthStateChanged(auth, user => {
  if (user) {
    userInfo.textContent = "Welcome, " + user.displayName;
    signInBtn.style.display = "none";
    signOutBtn.style.display = "inline-block";
    profileBtn.style.display = "inline-block";
  } else {
    userInfo.textContent = "";
    signInBtn.style.display = "inline-block";
    signOutBtn.style.display = "none";
    profileBtn.style.display = "none";
  }
});
