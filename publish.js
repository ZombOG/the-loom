import { auth, onAuthStateChanged } from './firebase.js';
import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const form = document.querySelector('form');
const textarea = form.querySelector('textarea');
const creditInput = form.querySelector('input[type="text"]');

onAuthStateChanged(auth, user => {
  if (user) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const content = textarea.value.trim();
      const credit = creditInput.value.trim();

      if (!content) return alert("Post content is required");

      await addDoc(collection(db, 'posts'), {
        content,
        credit: credit || null,
        author: user.displayName,
        uid: user.uid,
        timestamp: serverTimestamp()
      });

      form.reset();
      alert("Post published!");
    });
  } else {
    alert("You must be signed in to publish.");
  }
});