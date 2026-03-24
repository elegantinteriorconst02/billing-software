import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db, auth } from "./firebase.js";

const COLLECTION = "recycleBin";

/* ============================= */
/* ♻ MOVE TO BIN */
/* ============================= */
export async function moveToRecycleBin(type, data){

  const user = auth.currentUser;
  if(!user) throw new Error("User not logged in");

  await addDoc(collection(db, COLLECTION), {
    type,
    originalId: data.id,
    userId: user.uid,
    data,
    deletedAt: serverTimestamp()
  });
}

/* ============================= */
/* 📥 GET BIN DATA */
/* ============================= */
export async function getRecycleBin(){

  const user = auth.currentUser;
  if(!user) return [];

  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", user.uid),
    orderBy("deletedAt", "desc")
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
/* 🔁 RESTORE */
/* ============================= */
export async function restoreFromRecycleBin(item){

  const user = auth.currentUser;
  if(!user) throw new Error("User not logged in");

  const { type, data } = item;

  // 🔥 dynamic restore
  let collectionName = "";

  if(type === "client") collectionName = "clients";
  if(type === "vendor") collectionName = "vendors";
  if(type === "vendorItem") collectionName = "vendorItems";
  if(type === "bill") collectionName = "bills";

  if(!collectionName) return;

  // restore document
  await addDoc(collection(db, collectionName), {
    ...data,
    userId: user.uid,
    restoredAt: serverTimestamp()
  });

  // delete from recycle
  await deleteDoc(doc(db, COLLECTION, item.id));
}

/* ============================= */
/* 🗑 DELETE PERMANENT */
/* ============================= */
export async function deleteFromRecycleBin(id){

  await deleteDoc(doc(db, COLLECTION, id));
}
