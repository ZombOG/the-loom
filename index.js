
import { db } from './firebase.js';
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const feedDiv = document.getElementById("post-feed");

async function loadAllPosts() {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);

  feedDiv.innerHTML = ""; // Clear existing content

  querySnapshot.forEach((doc) => {
    const post = doc.data();
    const postEl = document.createElement("div");
    postEl.className = "post";
    postEl.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.description}</p>
      ${post.mediaUrl ? `<p><a href="${post.mediaUrl}" target="_blank">Media</a></p>` : ""}
      ${post.creditId ? `<p>Credit: ${post.creditId}</p>` : ""}
    `;
    feedDiv.appendChild(postEl);
  });
}

loadAllPosts();
