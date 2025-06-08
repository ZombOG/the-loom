import { auth, provider, signInWithPopup, signOut, onAuthStateChanged } from './firebase.js';
import { db } from './firebase.js';
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const signInBtn = document.getElementById('sign-in');
const signOutBtn = document.getElementById('sign-out');
const authStatus = document.getElementById('auth-status');

signInBtn?.addEventListener('click', () => {
  signInWithPopup(auth, provider);
});

signOutBtn?.addEventListener('click', () => {
  signOut(auth);
});

onAuthStateChanged(auth, async user => {
  if (user) {
    const userRef = doc(db, 'users', user.uid);
    try {
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          username: user.displayName || "Unnamed",
          bio: "This user hasn't written a bio yet.",
          followers: 0,
          following: 0,
          email: user.email || null,
          createdAt: serverTimestamp()
        });
        console.log("✅ User profile created in Firestore.");
      }
      const latest = await getDoc(userRef);
      const username = latest.data().username || "User";
      if (authStatus) authStatus.textContent = `Signed in as ${username}`;
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
    }

    signInBtn?.classList.add('hidden');
    signOutBtn?.classList.remove('hidden');
  } else {
    if (authStatus) authStatus.textContent = 'Not signed in';
    signInBtn?.classList.remove('hidden');
    signOutBtn?.classList.add('hidden');
  }
});