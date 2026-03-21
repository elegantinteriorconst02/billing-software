import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { auth } from "./firebase.js";
import { db } from "./firebase.js";

const COLLECTION = "vendorItems";
const RECYCLE = "recycleBin";

/* ============================= */
/* 📥 GET ALL ITEMS BY VENDOR */
/* ============================= */
export async function getItemsByVendor(vendorId){
  const user = auth.currentUser;
  if(!user) return [];

  const q = query(
    collection(db, COLLECTION),
    where("vendorId", "==", vendorId),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(q);
  const list = [];

  snapshot.forEach(docSnap=>{
    list.push({ id: docSnap.id, ...docSnap.data() });
  });

  return list;
}

/* ============================= */
/* 💾 SAVE ITEM */
/* ============================= */
export async function saveVendorItem(item){
  const user = auth.currentUser;
  if(!user) throw new Error("User not logged in");

  const itemId = "VI-" + Date.now();

  const data = {
    ...item,
    id: itemId,
    userId: user.uid,
    createdAt: serverTimestamp()
  };

  await setDoc(doc(db, COLLECTION, itemId), data);

  return itemId;
}

/* ============================= */
/* ♻ MOVE TO RECYCLE BIN */
/* ============================= */
async function moveToRecycleBin(type, data){
  const user = auth.currentUser;
  if(!user) return;

  await addDoc(collection(db, RECYCLE), {
    type,
    originalId: data.id,
    userId: user.uid,
    data,
    deletedAt: serverTimestamp()
  });
}

/* ============================= */
/* 🗑 DELETE ITEM */
/* ============================= */
export async function deleteVendorItem(id){
  const user = auth.currentUser;
  if(!user) return;

  const q = query(
    collection(db, COLLECTION),
    where("id", "==", id),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(q);
  if(snapshot.empty) return;

  const docSnap = snapshot.docs[0];
  const itemData = { id: docSnap.id, ...docSnap.data() };

  // move to recycle
  await moveToRecycleBin("vendorItem", itemData);

  // delete
  await deleteDoc(doc(db, COLLECTION, docSnap.id));
}
