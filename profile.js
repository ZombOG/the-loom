import { auth, onAuthStateChanged } from './firebase.js';
import { db } from './firebase.js';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const feed = document.getElementById('user-post-feed');
const userInfo = document.getElementById('user-info');

async function loadUserMeta(uid) {
  const userDocRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userDocRef);
  if (userSnap.exists()) {
    const data = userSnap.data();
    userInfo.innerHTML = `
      <h2>${data.username || "Unnamed User"}</h2>
      <p><strong>Bio:</strong> ${data.bio || "No bio available."}</p>
      <p><strong>Followers:</strong> ${data.followers || 0}</p>
      <p><strong>Following:</strong> ${data.following || 0}</p>
    `;
  } else {
    userInfo.textContent = "User profile not found.";
  }
}

onAuthStateChanged(auth, async user => {
  if (user) {
    await loadUserMeta(user.uid);

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
    userInfo.textContent = "You must be signed in to view your profile.";
  }
});