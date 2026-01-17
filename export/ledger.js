function exportClientLedger(){
  const client = document.getElementById("ledgerClient").value;
  if(!client) return alert("Select client");

  const bills = JSON.parse(localStorage.getItem("bills")||"[]")
    .filter(b => b.clientName === client);

  if(!bills.length){
    alert("No bills for this client");
    return;
  }

  bills.sort((a,b)=>a.date.localeCompare(b.date));

  let balance = 0;

  const rows = bills.map(b=>{
    const amt = Number(b.totals.grand || 0);
    balance += amt;

    return {
      Date: b.date,
      Type: b.type,
      Number: b.number,
      Debit: amt.toFixed(2),
      Credit: "",
      Balance: balance.toFixed(2)
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Ledger");

  XLSX.writeFile(
    wb,
    `LEDGER-${client.replace(/\s+/g,"_")}.xlsx`
  );
}
