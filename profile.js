
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  setDoc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBiO6ibYUHPgcDTD3ycps_PTB8BQJiErTY",
  authDomain: "the-loom-f2e10.firebaseapp.com",
  projectId: "the-loom-f2e10",
  storageBucket: "the-loom-f2e10.appspot.com",
  messagingSenderId: "54331315583",
  appId: "1:54331315583:web:186ae891eff7f00111764a",
  measurementId: "G-FHHHG2R0PV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const signOutLink = document.getElementById("sign-out-link");
if (signOutLink) {
  signOutLink.onclick = () => signOut(auth);
}

const displayNameEl = document.getElementById("displayName");
const usernameEl = document.getElementById("username");
const bioEl = document.getElementById("bio");
const editForm = document.getElementById("edit-form");
const editBioInput = document.getElementById("edit-bio");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      displayNameEl.textContent = data.displayName || user.email;
      usernameEl.textContent = "@" + (data.username || user.email.split("@")[0]);
      bioEl.textContent = data.bio || "No bio yet.";
      editBioInput.value = data.bio || "";
    }

    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newBio = editBioInput.value.trim();
      await setDoc(docRef, { bio: newBio }, { merge: true });
      bioEl.textContent = newBio;
    });

    const postQuery = query(
      collection(db, "posts"),
      where("uid", "==", user.uid),
      orderBy("timestamp", "desc")
    );
    const postSnapshot = await getDocs(postQuery);
    const postContainer = document.createElement("div");
    postContainer.className = "bio-card";
    postContainer.innerHTML = "<h3>Your Posts</h3>";

    postSnapshot.forEach((docSnap) => {
      const post = docSnap.data();
      const el = document.createElement("div");
      el.className = "post-preview";
      el.innerHTML = `
        <h4 contenteditable="true" data-id="${docSnap.id}" class="editable-title">${post.title}</h4>
        <p contenteditable="true" data-id="${docSnap.id}" class="editable-desc">${post.description}</p>
        <small>Media: <a href="${post.mediaUrl}" target="_blank">View</a></small><br>
        <small>Credit ID: ${post.creditId || "None"}</small><br>
        <button data-id="${docSnap.id}" class="save-btn">💾 Save</button>
        <button data-id="${docSnap.id}" class="delete-btn">🗑️ Delete</button>
        <hr>
      `;
      postContainer.appendChild(el);
    });

    document.body.appendChild(postContainer);

    document.querySelectorAll(".save-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        const title = document.querySelector(`.editable-title[data-id="${id}"]`).innerText.trim();
        const desc = document.querySelector(`.editable-desc[data-id="${id}"]`).innerText.trim();
        await updateDoc(doc(db, "posts", id), {
          title,
          description: desc
        });
        alert("Post updated!");
      });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (confirm("Are you sure you want to delete this post?")) {
          await deleteDoc(doc(db, "posts", id));
          alert("Post deleted.");
          e.target.closest(".post-preview").remove();
        }
      });
    });
  } else {
    displayNameEl.textContent = "Not signed in";
    usernameEl.textContent = "@unknown";
    bioEl.textContent = "Please sign in to view your profile.";
  }
});
