const PURCHASE_KEY = "purchases";

/* GET */
function getPurchases(){
  return JSON.parse(localStorage.getItem(PURCHASE_KEY) || "[]");
}

/* SAVE */
function savePurchase(p){
  let cgst=0, sgst=0, igst=0;

  p.items.forEach(i=>{
    const gstAmt = i.total * i.gst / 100;
    if(p.gstType === "intra"){
      cgst += gstAmt/2;
      sgst += gstAmt/2;
    }else{
      igst += gstAmt;
    }
  });

  p.gstSummary = {
    cgst: cgst.toFixed(2),
    sgst: sgst.toFixed(2),
    igst: igst.toFixed(2)
  };

  const list = getPurchases();
  p.id = "PUR-" + Date.now();
  list.push(p);
  localStorage.setItem(PURCHASE_KEY, JSON.stringify(list));
}

attachments: [
  {
    name: "bill1.pdf",
    type: "application/pdf",
    data: "base64...."
  },
  {
    name: "photo.jpg",
    type: "image/jpeg",
    data: "base64..."
  }
]
