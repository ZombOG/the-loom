import { auth, onAuthStateChanged } from './firebase.js';
import { db } from './firebase.js';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const feed = document.getElementById('user-post-feed');
const userInfo = document.getElementById('user-info');

async function loadUserMeta(uid) {
  try {
    const userDoc = doc(db, 'users', uid);
    const snap = await getDoc(userDoc);
    if (snap.exists()) {
      const data = snap.data();
      console.log("✅ Loaded user profile:", data);
      userInfo.innerHTML = `
        <h2>${data.username || "Unnamed User"}</h2>
        <p><strong>Bio:</strong> ${data.bio || "No bio available."}</p>
        <p><strong>Followers:</strong> ${data.followers ?? 0}</p>
        <p><strong>Following:</strong> ${data.following ?? 0}</p>
        <p><a href="profile_settings.html"><button>Edit Profile</button></a></p>
      `;
    } else {
      console.warn("⚠️ No user document found for:", uid);
      userInfo.innerHTML = "No profile found.";
    }
  } catch (err) {
    console.error("❌ Error loading user metadata:", err);
    userInfo.innerHTML = "Error loading profile.";
  }
}

onAuthStateChanged(auth, async user => {
  if (user) {
    console.log("🔑 User signed in:", user.uid);
    await loadUserMeta(user.uid);

    const postsCol = collection(db, 'posts');
    const q = query(postsCol, where('uid', '==', user.uid), orderBy('timestamp', 'desc'));
    const postSnap = await getDocs(q);

    postSnap.forEach(doc => {
      const post = doc.data();
      console.log("📬 Post loaded:", post);
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
    console.log("🚪 User not signed in.");
    userInfo.textContent = "You must be signed in to view your profile.";
  }
});