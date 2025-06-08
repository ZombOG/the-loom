import { auth, onAuthStateChanged } from './firebase.js';
import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("publish-form");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const mediaInput = document.getElementById("media");
const creditInput = document.getElementById("credit");
const statusMsg = document.getElementById("publish-status");

onAuthStateChanged(auth, (user) => {
  if (user) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = titleInput.value.trim();
      const description = descriptionInput.value.trim();
      const media = mediaInput.value.trim();
      const credit = creditInput.value.trim();

      if (!title || !description) {
        statusMsg.textContent = "Title and Description are required.";
        return;
      }

      try {
        await addDoc(collection(db, "posts"), {
          title,
          description,
          media: media || null,
          credit: credit || null,
          author: user.displayName,
          uid: user.uid,
          timestamp: serverTimestamp(),
        });

        titleInput.value = "";
        descriptionInput.value = "";
        mediaInput.value = "";
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