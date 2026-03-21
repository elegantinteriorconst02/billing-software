import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
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
/* 📥 GET ITEMS BY VENDOR */
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
/* 🔎 GET SINGLE ITEM */
/* ============================= */
export async function getVendorItem(id){
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);

  if(!snap.exists()) return null;

  return { id: snap.id, ...snap.data() };
}

/* ============================= */
/* ✏ UPDATE ITEM */
/* ============================= */
export async function updateVendorItem(item){
  if(!item.id) throw new Error("Item ID missing");

  const ref = doc(db, COLLECTION, item.id);

  await setDoc(ref, {
    ...item,
    updatedAt: serverTimestamp()
  }, { merge: true });
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
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);

  if(!snap.exists()) return;

  const itemData = { id: snap.id, ...snap.data() };

  // move to recycle bin
  await moveToRecycleBin("vendorItem", itemData);

  // delete from main collection
  await deleteDoc(ref);
}
