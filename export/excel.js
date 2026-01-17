function getBills(){
  return JSON.parse(localStorage.getItem("bills") || "[]");
}

/* ===== Monthly Sales Register ===== */
function exportMonthlyExcel(){
  const m = document.getElementById("exportMonth").value;
  if(!m) return alert("Select month");

  const bills = getBills().filter(b => b.date?.startsWith(m));
  if(!bills.length) return alert("No bills found");

  const rows = bills.map(b => ({
    Date: b.date,
    Type: b.type,
    Invoice_No: b.number,
    Client: b.clientName,
    GSTIN: b.gst || "",
    Taxable: b.totals.taxable,
    CGST: b.totals.cgst,
    SGST: b.totals.sgst,
    IGST: b.totals.igst,
    Total: b.totals.grand
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sales Register");

  XLSX.writeFile(wb, `${m}-SALES-REGISTER.xlsx`);
}

/* ===== Monthly GST Summary ===== */
function exportMonthlyGST(){
  const m = document.getElementById("exportMonth").value;
  if(!m) return alert("Select month");

  const bills = getBills().filter(b => b.date?.startsWith(m));
  if(!bills.length) return alert("No bills found");

  let cgst=0, sgst=0, igst=0, taxable=0, total=0;

  bills.forEach(b=>{
    taxable += +b.totals.taxable;
    cgst += +b.totals.cgst;
    sgst += +b.totals.sgst;
    igst += +b.totals.igst;
    total += +b.totals.grand;
  });

  const rows = [{
    Month: m,
    Taxable: taxable.toFixed(2),
    CGST: cgst.toFixed(2),
    SGST: sgst.toFixed(2),
    IGST: igst.toFixed(2),
    Total_GST: (cgst+sgst+igst).toFixed(2),
    Grand_Total: total.toFixed(2),
    Invoice_Count: bills.length
  }];

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "GST Summary");

  XLSX.writeFile(wb, `${m}-GST-SUMMARY.xlsx`);
}
