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
/* ✅ GET ALL VENDORS (Once) */
/* ============================= */
export async function getVendors() {
  const user = auth.currentUser;
  if (!user) return [];

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
/* ✅ REALTIME LISTENER */
/* ============================= */
export function listenVendors(callback) {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(
    collection(db, VENDOR_COLLECTION),
    where("userId", "==", user.uid),
    where("isDeleted", "==", false),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const list = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    callback(list);
  });
}

/* ============================= */
/* ✅ SAVE VENDOR */
/* ============================= */
export async function saveVendor(v) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

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

  return vendorId;
}

/* ============================= */
/* ✅ GET SINGLE VENDOR */
/* ============================= */
export async function getVendor(id) {
  const vendorRef = doc(db, VENDOR_COLLECTION, id);
  const snap = await getDoc(vendorRef);

  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() };
}

/* ============================= */
/* ✅ UPDATE VENDOR */
/* ============================= */
export async function updateVendor(v) {
  if (!v.id) throw new Error("Vendor ID missing");

  const vendorRef = doc(db, VENDOR_COLLECTION, v.id);

  await updateDoc(vendorRef, {
    ...v,
    updatedAt: serverTimestamp()
  });
}

/* ============================= */
/* ♻ MOVE TO RECYCLE BIN */
/* ============================= */
async function moveToRecycleBin(type, data) {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, RECYCLE_COLLECTION), {
    type,
    originalId: data.id,
    userId: user.uid,
    data,
    deletedAt: serverTimestamp()
  });
}

/* ============================= */
/* 🗑 DELETE VENDOR */
/* ============================= */
export async function deleteVendor(id) {
  const vendorRef = doc(db, VENDOR_COLLECTION, id);
  const snap = await getDoc(vendorRef);

  if (!snap.exists()) return;

  const vendorData = { id: snap.id, ...snap.data() };

  // move to recycle bin
  await moveToRecycleBin("vendor", vendorData);

  // hard delete
  await deleteDoc(vendorRef);
}
