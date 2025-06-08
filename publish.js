
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Firebase config
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
const db = getFirestore(app);
const auth = getAuth(app);

const form = document.getElementById("publish-form");
const statusDiv = document.getElementById("publish-status");

onAuthStateChanged(auth, user => {
  if (user) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = document.getElementById("post-title").value.trim();
      const description = document.getElementById("post-description").value.trim();
      const mediaUrl = document.getElementById("post-media-url").value.trim();
      const creditId = document.getElementById("post-credit-id").value.trim();

      if (!title || !description) {
        statusDiv.textContent = "Title and description are required.";
        return;
      }

      try {
        await addDoc(collection(db, "posts"), {
          title,
          description,
          mediaUrl,
          creditId,
          uid: user.uid,
          timestamp: serverTimestamp()
        });

        statusDiv.textContent = "Post published successfully!";
        form.reset();
      } catch (err) {
        statusDiv.textContent = "Error publishing post.";
        console.error(err);
      }
    });
  } else {
    window.location.href = "index.html";
  }
});
