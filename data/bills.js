import { db } from "./firebase.js";
import { collection, addDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const BILL_KEY = "bills";

/* =========================
   SAVE BILL
========================= */
export async function saveBill(bill){

  // LocalStorage save (offline backup)
  const bills = Storage.get(BILL_KEY);
  bill.id = bill.id || Storage.uid("BILL");

  bills.push(bill);
  Storage.set(BILL_KEY, bills);

  // 🔥 Firestore Save
  try{
    await addDoc(collection(db, "bills"), bill);
    console.log("Saved to Firestore");
  }catch(e){
    console.error("Firestore Error:", e);
  }
}


/* =========================
   GET BILLS
========================= */
export function getBills(){
  return Storage.get(BILL_KEY);
}

export function getBillById(id){
  return getBills().find(b => b.id === id);
}


/* =========================
   DELETE BILL
========================= */
export function deleteBill(id){

  const bills = getBills();
  const bill = bills.find(b => b.id === id);
  if(!bill) return;

  // ♻ Move to recycle bin
  moveToRecycleBin("bill", bill);

  const updated = bills.filter(b => b.id !== id);
  Storage.set(BILL_KEY, updated);
}

