import { auth, provider, signInWithPopup, signOut, onAuthStateChanged } from './firebase.js';

const signInBtn = document.getElementById('sign-in');
const signOutBtn = document.getElementById('sign-out');
const userInfo = document.getElementById('user-info');

signInBtn?.addEventListener('click', () => {
  signInWithPopup(auth, provider);
});

signOutBtn?.addEventListener('click', () => {
  signOut(auth);
});

onAuthStateChanged(auth, user => {
  if (user) {
    userInfo.textContent = `Signed in as ${user.displayName}`;
    signInBtn?.classList.add('hidden');
    signOutBtn?.classList.remove('hidden');
  } else {
    userInfo.textContent = 'Not signed in';
    signInBtn?.classList.remove('hidden');
    signOutBtn?.classList.add('hidden');
  }
});