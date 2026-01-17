function saveCompany(){
  localStorage.setItem("company", JSON.stringify({
    name:cName.value,
    addr:cAddr.value,
    gst:cGst.value
  }));
  alert("Company Saved");
}

function saveBilling(){
  localStorage.setItem("billing", JSON.stringify({
    prefix:invoicePrefix.value,
    start:invoiceStart.value,
    autoDate:autoDate.checked
  }));
  alert("Billing Saved");
}

function saveTheme(){
  localStorage.setItem("theme", themeSelect.value);
  alert("Theme Applied (reload later)");
}

function saveLayout(){
  localStorage.setItem("invoiceLayout", layoutSelect.value);
  alert("Layout Saved");
}
