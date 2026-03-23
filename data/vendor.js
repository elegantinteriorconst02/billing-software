import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { auth } from "./firebase.js";
import { db } from "./firebase.js";

const VENDOR_COLLECTION = "vendors";
const RECYCLE_COLLECTION = "recycleBin";

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
/* ✅ GET ALL VENDORS */
/* ============================= */
export async function getVendors() {
  const user = getUser();

  const q = query(
    collection(db, VENDOR_COLLECTION),
    where("userId", "==", user.uid),
    where("isDeleted", "==", false),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  const list = [];

  snapshot.forEach((docSnap) => {
    list.push({ id: docSnap.id, ...docSnap.data() });
  });

  return list;
}

/* ============================= */
/* ✅ SAVE VENDOR */
/* ============================= */
export async function saveVendor(v) {
  const user = getUser();

  console.log("Saving vendor...", v);

  const vendorId = "VD-" + Date.now();

  const vendorData = {
    ...v,
    id: vendorId,
    userId: user.uid,
    isDeleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(doc(db, VENDOR_COLLECTION, vendorId), vendorData);

  console.log("Vendor saved:", vendorId);

  return vendorId;
}

/* ============================= */
/* ✅ GET SINGLE */
/* ============================= */
export async function getVendor(id) {
  const vendorRef = doc(db, VENDOR_COLLECTION, id);
  const snap = await getDoc(vendorRef);

  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() };
}

/* ============================= */
/* ✅ UPDATE */
/* ============================= */
export async function updateVendor(v) {
  const user = getUser();

  if (!v.id) throw new Error("Vendor ID missing");

  const vendorRef = doc(db, VENDOR_COLLECTION, v.id);

  await updateDoc(vendorRef, {
    ...v,
    updatedAt: serverTimestamp()
  });

  console.log("Vendor updated");
}

/* ============================= */
/* ♻ RECYCLE BIN */
/* ============================= */
async function moveToRecycleBin(type, data) {
  const user = getUser();

  await addDoc(collection(db, RECYCLE_COLLECTION), {
    type,
    originalId: data.id,
    userId: user.uid,
    data,
    deletedAt: serverTimestamp()
  });
}

/* ============================= */
/* 🗑 DELETE */
/* ============================= */
export async function deleteVendor(id) {
  const vendorRef = doc(db, VENDOR_COLLECTION, id);
  const snap = await getDoc(vendorRef);

  if (!snap.exists()) return;

  const vendorData = { id: snap.id, ...snap.data() };

  await moveToRecycleBin("vendor", vendorData);
  await deleteDoc(vendorRef);

  console.log("Vendor deleted");
}
