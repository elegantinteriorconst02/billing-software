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
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 ADD THIS (IMPORTANT)
import { moveToRecycleBin } from "./recycle.js";

const COLLECTION = "clients";

/* ============================= */
/* 🔐 SAFE USER CHECK */
/* ============================= */
function getUser(){
  const user = auth.currentUser;
  if(!user){
    throw new Error("User not logged in");
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

  getUser();

  if(!client.id) throw new Error("Client ID missing");

  const ref = doc(db, COLLECTION, client.id);

  await updateDoc(ref, {
    ...client,
    updatedAt: serverTimestamp()
  });

  console.log("Client updated");
}

/* ============================= */
/* 🗑 DELETE → RECYCLE BIN */
/* ============================= */
export async function deleteClient(id) {

  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);

  if(!snap.exists()) return;

  const clientData = { id: snap.id, ...snap.data() };

  console.log("Deleting client:", clientData);

  // ♻ move to recycle bin
  await moveToRecycleBin("client", clientData);

  // ❌ delete from main collection
  await deleteDoc(ref);

  console.log("Client moved to recycle bin");
}
