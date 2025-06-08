import { auth, onAuthStateChanged } from './firebase.js';
import { db } from './firebase.js';
import { collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const feed = document.getElementById('user-post-feed');

onAuthStateChanged(auth, async user => {
  if (user) {
    document.getElementById('user-info').textContent = `Signed in as ${user.displayName}`;

    const postsCol = collection(db, 'posts');
    const q = query(postsCol, where('uid', '==', user.uid), orderBy('timestamp', 'desc'));
    const postSnap = await getDocs(q);

    postSnap.forEach(doc => {
      const post = doc.data();
      const postEl = document.createElement('div');
      postEl.className = 'post';
      postEl.innerHTML = `
        <h2>${post.title}</h2>
        <h4>by ${post.author}</h4>
        <p>${post.description}</p>
        ${post.media ? `<p><a href="${post.media}" target="_blank">📎 Media Link</a></p>` : ''}
        ${post.credit ? `<p class="credit">Credit: ${post.credit}</p>` : ''}
        <small>${new Date(post.timestamp?.toDate?.() || Date.now()).toLocaleString()}</small>
      `;
      feed.appendChild(postEl);
    });

  } else {
    document.getElementById('user-info').textContent = "You must be signed in to view your posts.";
  }
});