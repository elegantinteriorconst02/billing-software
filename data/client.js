import { db, auth } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


/* =========================
   GET ALL CLIENTS (LATEST FIRST)
========================= */
export async function getClients() {

  const user = auth.currentUser;
  if (!user) return [];

  try {

    const q = query(
      collection(db, "clients"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

  } catch (error) {
    console.error("Get Clients Error:", error);
    return [];
  }
}


/* =========================
   GET SINGLE CLIENT (DIRECT FETCH)
========================= */
export async function getClientById(id) {

  try {
    const snap = await getDoc(doc(db, "clients", id));

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data()
    };

  } catch (error) {
    console.error("Get Client Error:", error);
    return null;
  }
}


/* =========================
   SAVE CLIENT
========================= */
export async function saveClient(client) {

  const user = auth.currentUser;
  if (!user) return;

  try {

    await addDoc(collection(db, "clients"), {
      ...client,
      uid: user.uid,
      createdAt: serverTimestamp()
    });

  } catch (error) {
    console.error("Save Client Error:", error);
  }
}


/* =========================
   UPDATE CLIENT
========================= */
export async function updateClient(client) {

  try {

    const clientRef = doc(db, "clients", client.id);

    await updateDoc(clientRef, {
      name: client.name,
      mobile: client.mobile,
      email: client.email,
      gst: client.gst,
      state: client.state,
      pin: client.pin,
      address: client.address,
      notes: client.notes,
      updatedAt: serverTimestamp()
    });

  } catch (error) {
    console.error("Update Client Error:", error);
  }
}


/* =========================
   DELETE CLIENT (SAFE DELETE)
========================= */
export async function deleteClient(id) {

  try {
    await deleteDoc(doc(db, "clients", id));
  } catch (error) {
    console.error("Delete Client Error:", error);
  }
}
