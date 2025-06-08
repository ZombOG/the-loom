
import { db } from "./firebase.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {
  const postButton = document.getElementById("post-button");
  const postTitle = document.getElementById("post-title");
  const postContent = document.getElementById("post-content");
  const statusText = document.getElementById("status");

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      statusText.textContent = "You must be signed in to publish a post.";
      return;
    }

    postButton.addEventListener("click", async () => {
      const title = postTitle.value.trim();
      const content = postContent.value.trim();

      if (!content) {
        statusText.textContent = "Post content cannot be empty.";
        return;
      }

      try {
        const docRef = await addDoc(collection(db, "posts"), {
          uid: user.uid,
          displayName: user.displayName || "Anonymous",
          title: title || "Untitled",
          content,
          timestamp: serverTimestamp(),
          credits: []
        });
        console.log("Post created with ID:", docRef.id);
        statusText.textContent = "Post published successfully!";
        postTitle.value = "";
        postContent.value = "";
      } catch (err) {
        console.error("Error publishing post:", err);
        statusText.textContent = "Failed to publish post.";
      }
    });
  });
});
