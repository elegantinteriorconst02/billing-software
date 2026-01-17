const RECYCLE_KEY = "recycle_bin";
const RECYCLE_DAYS = 30;

/* ===== HELPERS ===== */
function getRecycleBin(){
  cleanupRecycleBin();
  return JSON.parse(localStorage.getItem(RECYCLE_KEY) || "[]");
}

function saveRecycleBin(list){
  localStorage.setItem(RECYCLE_KEY, JSON.stringify(list));
}

/* ===== MOVE TO BIN ===== */
function moveToRecycleBin(type, data){
  const list = getRecycleBin();

  list.push({
    id: "RB-" + Date.now(),
    type,                 // client | vendor | bill
    data,                 // full object
    deletedAt: Date.now()
  });

  saveRecycleBin(list);
}

/* ===== RESTORE ===== */
function restoreFromRecycleBin(id){
  const list = getRecycleBin();
  const item = list.find(x=>x.id===id);
  if(!item) return;

  if(item.type === "client"){
    const clients = JSON.parse(localStorage.getItem("clients")||"[]");
    clients.push(item.data);
    localStorage.setItem("clients", JSON.stringify(clients));
  }

  if(item.type === "vendor"){
    const vendors = JSON.parse(localStorage.getItem("vendors")||"[]");
    vendors.push(item.data);
    localStorage.setItem("vendors", JSON.stringify(vendors));
  }

  if(item.type === "bill"){
    const bills = JSON.parse(localStorage.getItem("bills")||"[]");
    bills.push(item.data);
    localStorage.setItem("bills", JSON.stringify(bills));
  }

  deleteFromRecycleBin(id);
}

/* ===== DELETE PERMANENT ===== */
function deleteFromRecycleBin(id){
  let list = getRecycleBin().filter(x=>x.id!==id);
  saveRecycleBin(list);
}

/* ===== AUTO CLEANUP (30 DAYS) ===== */
function cleanupRecycleBin(){
  const now = Date.now();
  let list = JSON.parse(localStorage.getItem(RECYCLE_KEY) || "[]");

  list = list.filter(item=>{
    return (now - item.deletedAt) <= RECYCLE_DAYS * 24 * 60 * 60 * 1000;
  });

  saveRecycleBin(list);
}
