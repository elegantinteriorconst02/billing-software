const data = JSON.parse(localStorage.getItem("invoiceData"));

companyName.innerText = data.company.name;
billTo.innerText = data.bill.name;
itemTable.innerHTML = data.tableHTML;
grand.innerText = data.grand;
