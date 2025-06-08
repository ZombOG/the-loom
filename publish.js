import { auth, onAuthStateChanged } from './firebase.js';
import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("publish-form");
const contentInput = document.getElementById("post-content");
const creditInput = document.getElementById("credit");
const statusMsg = document.getElementById("publish-status");

onAuthStateChanged(auth, (user) => {
  if (user) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const content = contentInput.value.trim();
      const credit = creditInput.value.trim();

      if (!content) {
        statusMsg.textContent = "Post content is required.";
        return;
      }

      try {
        await addDoc(collection(db, "posts"), {
          content,
          credit: credit || null,
          author: user.displayName,
          uid: user.uid,
          timestamp: serverTimestamp(),
        });

        contentInput.value = "";
        creditInput.value = "";
        statusMsg.textContent = "✅ Post published!";
      } catch (error) {
        console.error("Error publishing post:", error);
        statusMsg.textContent = "❌ Failed to publish. Try again.";
      }
    });
  } else {
    statusMsg.textContent = "You must be signed in to publish.";
  }
});