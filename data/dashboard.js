/* ===== DASHBOARD LOGIC ===== */

function loadDashboard(){

  const bills = (typeof getBills === "function")
    ? getBills()
    : [];

  let totalSales = 0;
  let totalGst = 0;
  let monthSales = 0;

  const now = new Date();
  const curMonth = now.getMonth();
  const curYear  = now.getFullYear();

  bills.forEach(b=>{
    const amt = Number(b.total || 0);
    totalSales += amt;

    const gst =
      Number(b.data?.totals?.cgst || 0) +
      Number(b.data?.totals?.sgst || 0) +
      Number(b.data?.totals?.igst || 0);

    totalGst += gst;

    if(b.date){
      const d = new Date(b.date);
      if(d.getMonth() === curMonth && d.getFullYear() === curYear){
        monthSales += amt;
      }
    }
  });

  // render
  document.getElementById("totalBills").innerText = bills.length;
  document.getElementById("totalSales").innerText = "₹ " + totalSales.toFixed(2);
  document.getElementById("totalGst").innerText   = "₹ " + totalGst.toFixed(2);
  document.getElementById("monthSales").innerText = "₹ " + monthSales.toFixed(2);
}

// auto run
document.addEventListener("DOMContentLoaded", loadDashboard);
