const user = JSON.parse(localStorage.getItem("user"));
const users = JSON.parse(localStorage.getItem("users") || "[]");

if(!user){
  location.href = "login.html";
}

const record = users.find(u => u.uid === user.uid);

if(!record || !record.approved){
  alert("Admin approval required");
  localStorage.removeItem("user");
  location.href = "login.html";
}
