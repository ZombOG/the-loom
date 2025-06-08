import { auth, onAuthStateChanged } from './firebase.js';
import { db } from './firebase.js';
import { collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const feed = document.getElementById('user-post-feed');
const userInfo = document.getElementById('user-info');

onAuthStateChanged(auth, async user => {
  if (user) {
    const userDoc = await (await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js")).getDoc(
      (await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js")).doc(db, 'users', user.uid)
    );
    const username = userDoc.exists() ? userDoc.data().username : "Unknown";
    userInfo.innerHTML = `<h2>${username}</h2><p><a href="profile_settings.html"><button>Edit Profile</button></a></p>`;

    const postsCol = collection(db, 'posts');
    const q = query(postsCol, where('uid', '==', user.uid), orderBy('timestamp', 'desc'));
    const postSnap = await getDocs(q);

    postSnap.forEach(doc => {
      const post = doc.data();
      const postEl = document.createElement('div');
      postEl.className = 'post';
      postEl.innerHTML = `
        <h2>${post.title}</h2>
        <h4>by ${post.username}</h4>
        <p>${post.description}</p>
        ${post.medialink ? `<p><a href="${post.medialink}" target="_blank">📎 Media Link</a></p>` : ''}
        ${post.credit ? `<p class="credit">Credit: ${post.credit}</p>` : ''}
        <small>${new Date(post.timestamp?.toDate?.() || Date.now()).toLocaleString()}</small>
      `;
      feed.appendChild(postEl);
    });

  } else {
    userInfo.textContent = "You must be signed in to view your posts.";
  }
});