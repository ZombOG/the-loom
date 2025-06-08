
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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
const db = getFirestore(app);

const displayNameEl = document.getElementById("displayName");
const usernameEl = document.getElementById("username");
const bioEl = document.getElementById("bio");
const editBioInput = document.getElementById("edit-bio");
const followersEl = document.getElementById("followers");
const followingEl = document.getElementById("following");
const form = document.getElementById("edit-form");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    displayNameEl.textContent = user.displayName || "Unnamed";
    usernameEl.textContent = "@" + (user.email?.split("@")[0] || "user");

    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // Automatically create a default profile document
      await setDoc(userRef, {
        bio: "",
        followers: 0,
        following: 0
      });
    }

    const data = (await getDoc(userRef)).data();
    bioEl.textContent = data.bio || "No bio yet.";
    editBioInput.value = data.bio || "";
    followersEl.textContent = data.followers || 0;
    followingEl.textContent = data.following || 0;

    form.onsubmit = async (e) => {
      e.preventDefault();
      const updatedBio = editBioInput.value.trim();
      await setDoc(userRef, {
        bio: updatedBio,
        followers: data.followers || 0,
        following: data.following || 0
      });
      bioEl.textContent = updatedBio;
      alert("Profile updated!");
    };
  } else {
    displayNameEl.textContent = "Not signed in";
    usernameEl.textContent = "@unknown";
    bioEl.textContent = "Please sign in to view your profile.";
    form.style.display = "none";
  }
});
