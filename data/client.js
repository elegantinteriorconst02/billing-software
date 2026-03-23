import { db, auth } from "./firebase.js";

import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const COLLECTION = "clients";

/* ============================= */
/* 🔐 SAFE USER CHECK */
/* ============================= */
function getUser(){
  const user = auth.currentUser;
  if(!user){
    alert("❌ User not logged in / not ready");
    throw new Error("User not ready");
  }
  return user;
}

/* ============================= */
/* ✅ GET ALL CLIENTS */
/* ============================= */
export async function getClients() {

  const user = getUser();

  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  const list = [];

  snap.forEach(docSnap=>{
    list.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });

  return list;
}

/* ============================= */
/* ✅ GET SINGLE CLIENT */
/* ============================= */
export async function getClientById(id) {

  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);

  if(!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data()
  };
}

/* ============================= */
/* ✅ SAVE CLIENT */
/* ============================= */
export async function saveClient(client) {

  const user = getUser();

  console.log("Saving client...", client);

  const clientId = "CL-" + Date.now();

  const data = {
    ...client,
    id: clientId,
    userId: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(doc(db, COLLECTION, clientId), data);

  console.log("Client saved:", clientId);

  return clientId;
}

/* ============================= */
/* ✅ UPDATE CLIENT */
/* ============================= */
export async function updateClient(client) {

  const user = getUser();

  if(!client.id) throw new Error("Client ID missing");

  const ref = doc(db, COLLECTION, client.id);

  await updateDoc(ref, {
    ...client,
    updatedAt: serverTimestamp()
  });

  console.log("Client updated");
}

/* ============================= */
/* 🗑 DELETE CLIENT */
/* ============================= */
export async function deleteClient(id) {

  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);

  if(!snap.exists()) return;

  await deleteDoc(ref);

  console.log("Client deleted");
}
