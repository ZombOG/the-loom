
import { auth } from './firebase.js';
import { db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const userInfo = document.getElementById('user-info');
const userPostFeed = document.getElementById('user-post-feed');

onAuthStateChanged(auth, async user => {
  if (user) {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      console.log("👤 Profile Data:", data);
      userInfo.innerHTML = `
        <h2>${data.username || "Unnamed User"}</h2>
        <p><strong>Bio:</strong> ${data.bio || "No bio available."}</p>
        <p><strong>Email:</strong> ${data.email || "Unknown"}</p>
        <p><strong>Followers:</strong> ${data.followers ?? 0}</p>
        <p><strong>Following:</strong> ${data.following ?? 0}</p>
      `;
    }

    const postsQuery = query(
      collection(db, "posts"),
      where("userId", "==", user.uid)
    );
    const postSnap = await getDocs(postsQuery);
    userPostFeed.innerHTML = "<h3>Your Posts:</h3>";
    postSnap.forEach(doc => {
      const post = doc.data();
      userPostFeed.innerHTML += `
        <div style="border: 1px solid #ccc; padding: 5px; margin: 5px;">
          <strong>${post.title}</strong><br />
          ${post.description}<br />
          <em>${new Date(post.createdAt?.seconds * 1000).toLocaleString()}</em>
        </div>
      `;
    });
  } else {
    userInfo.textContent = "Not signed in";
  }
});
