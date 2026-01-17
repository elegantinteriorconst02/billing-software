const VENDOR_KEY = "vendors";

function getVendors(){
  return JSON.parse(localStorage.getItem(VENDOR_KEY) || "[]");
}

function saveVendor(v){
  const list = getVendors();

  v.id = v.id || ("VD-" + Date.now());
  list.push(v);

  localStorage.setItem(VENDOR_KEY, JSON.stringify(list));
}

function updateVendor(v){
  let list = getVendors();
  list = list.map(x => x.id === v.id ? v : x);
  localStorage.setItem(VENDOR_KEY, JSON.stringify(list));
}

function getVendor(id){
  return getVendors().find(v => v.id === id);
}

/* ♻ DELETE → RECYCLE BIN */
function deleteVendor(id){
  const vendors = getVendors();
  const vendor  = vendors.find(v => v.id === id);
  if(!vendor) return;

  // move to recycle bin
  moveToRecycleBin("vendor", vendor);

  // remove from main list
  const updated = vendors.filter(v => v.id !== id);
  localStorage.setItem(VENDOR_KEY, JSON.stringify(updated));
}
