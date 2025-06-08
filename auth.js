import { auth, provider, signInWithPopup, signOut, onAuthStateChanged } from './firebase.js';
import { db } from './firebase.js';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const signInBtn = document.getElementById('sign-in');
const signOutBtn = document.getElementById('sign-out');
const userInfo = document.getElementById('user-info');

signInBtn?.addEventListener('click', () => {
  signInWithPopup(auth, provider);
});

signOutBtn?.addEventListener('click', () => {
  signOut(auth);
});

onAuthStateChanged(auth, async user => {
  if (user) {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create a default user profile if none exists
      await setDoc(userRef, {
        username: user.displayName || "Unnamed",
        bio: "This user hasn't written a bio yet.",
        followers: 0,
        following: 0,
        email: user.email || null,
        createdAt: new Date().toISOString()
      });
      console.log("✅ User profile created in Firestore.");
    }

    userInfo.textContent = `Signed in as ${user.displayName}`;
    signInBtn?.classList.add('hidden');
    signOutBtn?.classList.remove('hidden');
  } else {
    userInfo.textContent = 'Not signed in';
    signInBtn?.classList.remove('hidden');
    signOutBtn?.classList.add('hidden');
  }
});