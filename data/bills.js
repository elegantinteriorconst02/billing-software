import { db, auth } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


/* =========================
   SAVE BILL (CREATE)
========================= */
export async function saveBill(bill) {

  const user = auth.currentUser;
  if (!user) {
    console.error("User not logged in");
    return;
  }

  try {

    const docRef = await addDoc(
      collection(db, "bills"),
      {
        ...bill,
        uid: user.uid,
        createdAt: new Date()
      }
    );

    console.log("Bill saved ID:", docRef.id);
    return docRef.id;

  } catch (error) {
    console.error("Save Bill Error:", error);
  }
}


/* =========================
   GET ALL BILLS (USER WISE)
========================= */
export async function getBills() {

  const user = auth.currentUser;
  if (!user) return [];

  try {

    const q = query(
      collection(db, "bills"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  } catch (error) {
    console.error("Get Bills Error:", error);
    return [];
  }
}


/* =========================
   GET SINGLE BILL
========================= */
export async function getBillById(id) {

  try {
    const docRef = doc(db, "bills", id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data()
    };

  } catch (error) {
    console.error("Get Bill Error:", error);
    return null;
  }
}


/* =========================
   UPDATE BILL
========================= */
export async function updateBill(id, updatedData) {

  try {
    const docRef = doc(db, "bills", id);
    await updateDoc(docRef, updatedData);
  } catch (error) {
    console.error("Update Error:", error);
  }
}


/* =========================
   DELETE BILL (CLOUD)
========================= */
export async function deleteBill(id) {

  try {
    await deleteDoc(doc(db, "bills", id));
    console.log("Bill deleted from cloud");
  } catch (error) {
    console.error("Delete Error:", error);
  }
}
