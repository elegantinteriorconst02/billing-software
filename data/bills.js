import { db, auth } from "./firebase.js";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =========================
   SAVE BILL
========================= */
export async function saveBill(bill){

  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "bills"), {
    ...bill,
    uid: user.uid,
    createdAt: new Date()
  });
}


/* =========================
   GET USER BILLS
========================= */
export async function getBills(){

  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "bills"),
    where("uid", "==", user.uid)
  );

  const snap = await getDocs(q);

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
}


/* =========================
   DELETE BILL
========================= */
export async function deleteBill(id){
  await deleteDoc(doc(db, "bills", id));
}
