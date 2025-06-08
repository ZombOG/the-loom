import { db } from './firebase.js';
import { collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const feed = document.createElement('div');
feed.id = 'post-feed';
document.body.appendChild(feed);

async function loadPosts() {
  const postsCol = collection(db, 'posts');
  const q = query(postsCol, orderBy('timestamp', 'desc'));
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
}

loadPosts();