import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db, auth } from "./firebase.js";

const COLLECTION = "recycleBin";

/* ============================= */
/* 🔐 SAFE USER */
/* ============================= */
function getUser(){
  const user = auth.currentUser;
  if(!user) throw new Error("User not logged in");
  return user;
}

/* ============================= */
/* ♻ MOVE TO BIN */
/* ============================= */
export async function moveToRecycleBin(type, data){

  const user = getUser();

  console.log("♻ Moving to recycle:", type, data);

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

  const user = getUser();

  const { type, data } = item;

  let collectionName = "";

  if(type === "client") collectionName = "clients";
  else if(type === "vendor") collectionName = "vendors";
  else if(type === "vendorItem") collectionName = "vendorItems";
  else if(type === "bill") collectionName = "bills";

  if(!collectionName){
    console.warn("Unknown type:", type);
    return;
  }

  console.log("🔁 Restoring:", type, data);

  try{
    // 🔥 restore SAME ID (important)
    await setDoc(doc(db, collectionName, data.id), {
      ...data,
      userId: user.uid,
      restoredAt: serverTimestamp()
    });

    // remove from recycle bin
    await deleteDoc(doc(db, COLLECTION, item.id));

  }catch(err){
    console.error("Restore error:", err);
    throw err;
  }
}

/* ============================= */
/* 🗑 DELETE PERMANENT */
/* ============================= */
export async function deleteFromRecycleBin(id){

  try{
    await deleteDoc(doc(db, COLLECTION, id));
    console.log("Deleted permanently:", id);
  }catch(err){
    console.error("Delete error:", err);
  }
}
