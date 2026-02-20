import { db, auth } from "./firebase.js";
import {
  collection,
  query,
  where,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


/* =========================
   LOAD DASHBOARD (REALTIME)
========================= */

auth.onAuthStateChanged(user => {

  if (!user) return;

  const q = query(
    collection(db, "bills"),
    where("uid", "==", user.uid)
  );

  onSnapshot(q, snapshot => {

    let totalSales = 0;
    let totalGst   = 0;
    let monthSales = 0;

    const now = new Date();
    const curMonth = now.getMonth();
    const curYear  = now.getFullYear();

    const bills = snapshot.docs.map(doc => doc.data());

    bills.forEach(b => {

      const amt = Number(b.total || 0);
      totalSales += amt;

      const gst =
        Number(b.data?.totals?.cgst || 0) +
        Number(b.data?.totals?.sgst || 0) +
        Number(b.data?.totals?.igst || 0);

      totalGst += gst;

      if (b.date) {
        const d = new Date(b.date);
        if (d.getMonth() === curMonth &&
            d.getFullYear() === curYear) {
          monthSales += amt;
        }
      }

    });

    // Render
    document.getElementById("totalBills").innerText = bills.length;
    document.getElementById("totalSales").innerText = "₹ " + totalSales.toFixed(2);
    document.getElementById("totalGst").innerText   = "₹ " + totalGst.toFixed(2);
    document.getElementById("monthSales").innerText = "₹ " + monthSales.toFixed(2);

  });

});
