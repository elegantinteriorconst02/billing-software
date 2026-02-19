import { db, auth } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


/* =========================
   GET ALL CLIENTS
========================= */
export async function getClients() {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "clients"),
    where("uid", "==", user.uid)
  );

  const snap = await getDocs(q);

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
}


/* =========================
   GET SINGLE CLIENT
========================= */
export async function getClientById(id) {
  const list = await getClients();
  return list.find(c => c.id === id);
}


/* =========================
   SAVE CLIENT
========================= */
export async function saveClient(client) {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "clients"), {
    ...client,
    uid: user.uid,
    createdAt: new Date()
  });
}


/* =========================
   UPDATE CLIENT
========================= */
export async function updateClient(client) {

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
    updatedAt: new Date()
  });
}


/* =========================
   DELETE CLIENT
========================= */
export async function deleteClient(id){
  await deleteDoc(doc(db, "clients", id));
}
