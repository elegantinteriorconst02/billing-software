const VITEM_KEY = "vendorItems";

/*
 item = {
   id,
   vendorId,
   name,
   rate,
   gst,
   uom
 }
*/

function getVendorItems(){
  return JSON.parse(localStorage.getItem(VITEM_KEY) || "[]");
}

function getItemsByVendor(vendorId){
  return getVendorItems().filter(i => i.vendorId === vendorId);
}

function saveVendorItem(item){
  const list = getVendorItems();
  item.id = "VI-" + Date.now();
  list.push(item);
  localStorage.setItem(VITEM_KEY, JSON.stringify(list));
}

function deleteVendorItem(id){
  const list = getVendorItems();
  const bill = list.find(b => b.id === id);
  if(!bill) return;

  moveToRecycleBin("Vendor-items", Vendor-items);

  const updated = list.filter(b => b.id !== id);
  localStorage.setItem("Vendor-items", JSON.stringify(updated));
}
