const BILL_KEY = "bills";

function saveBill(bill){
  const bills = Storage.get(BILL_KEY);
  bill.id = bill.id || Storage.uid("BILL");
  bills.push(bill);
  Storage.set(BILL_KEY, bills);
}

function getBills(){
  return Storage.get(BILL_KEY);
}

function getBillById(id){
  return getBills().find(b => b.id === id);
}
function deleteBill(id){
  const bills = getBills();
  const bill = bills.find(b => b.id === id);
  if(!bill) return;

  // ♻️ Recycle bin এ পাঠাও
  moveToRecycleBin("bill", bill);

  // ❌ bills list থেকে delete
  const updated = bills.filter(b => b.id !== id);
  Storage.set(BILL_KEY, updated);
}
