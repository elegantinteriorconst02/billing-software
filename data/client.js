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

import { moveToRecycleBin } from "./recycle.js";

const COLLECTION = "clients";

/* ============================= */
/* 🔐 SAFE USER */
/* ============================= */
function getUser(){
  const user = auth.currentUser;
  if(!user){
    throw new Error("User not logged in");
  }
  return user;
}

/* ============================= */
/* ✅ GET ALL */
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
/* ✅ GET ONE */
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
/* ✅ SAVE */
/* ============================= */
export async function saveClient(client) {

  const user = getUser();

  const clientId = "CL-" + Date.now();

  const data = {
    name: client.name,
    mobile: client.mobile || "",
    email: client.email || "",
    gst: client.gst || "",
    state: client.state || "",
    pin: client.pin || "",
    address: client.address || "",
    notes: client.notes || "",
    userId: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(doc(db, COLLECTION, clientId), data);

  console.log("Client saved:", clientId);

  return clientId;
}

/* ============================= */
/* ✅ UPDATE */
/* ============================= */
export async function updateClient(client) {

  getUser();

  if(!client.id) throw new Error("Client ID missing");

  const ref = doc(db, COLLECTION, client.id);

  await updateDoc(ref, {
    name: client.name,
    mobile: client.mobile || "",
    email: client.email || "",
    gst: client.gst || "",
    state: client.state || "",
    pin: client.pin || "",
    address: client.address || "",
    notes: client.notes || "",
    updatedAt: serverTimestamp()
  });

  console.log("Client updated");
}

/* ============================= */
/* 🗑 DELETE → RECYCLE */
/* ============================= */
export async function deleteClient(id) {

  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);

  if(!snap.exists()) return;

  const clientData = { id: snap.id, ...snap.data() };

  console.log("Deleting client:", clientData);

  // 🔥 SAFE RECYCLE (no crash)
  try{
    await moveToRecycleBin("client", clientData);
  }catch(err){
    console.error("Recycle failed:", err);
  }

  // delete anyway
  await deleteDoc(ref);

  console.log("Client deleted + moved to recycle");
}
