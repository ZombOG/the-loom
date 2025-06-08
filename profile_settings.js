import { auth, onAuthStateChanged } from './firebase.js';
import { db } from './firebase.js';
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const userInfo = document.getElementById('user-info');
const form = document.getElementById('profile-form');
const usernameInput = document.getElementById('username');
const bioInput = document.getElementById('bio');
const status = document.getElementById('status');

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      usernameInput.value = data.username || '';
      bioInput.value = data.bio || '';
      userInfo.textContent = `Signed in as ${user.displayName}`;
      form.style.display = 'block';
    } else {
      userInfo.textContent = 'No user profile found.';
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await setDoc(userRef, {
          username: usernameInput.value.trim(),
          bio: bioInput.value.trim(),
        }, { merge: true });

        status.textContent = "✅ Profile updated successfully.";
      } catch (error) {
        console.error("Update error:", error);
        status.textContent = "❌ Failed to update profile.";
      }
    });
  } else {
    userInfo.textContent = "You must be signed in to edit your profile.";
  }
});