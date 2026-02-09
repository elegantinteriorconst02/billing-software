/* ======================================================
   🔑 BASE PATH (GitHub Pages + Local)
====================================================== */
const BASE_PATH = location.pathname.includes("/billing-software/")
  ? "/billing-software/"
  : "/";


/* ======================================================
   🔐 AUTH + APPROVAL GUARD (GLOBAL)
====================================================== */
const user  = JSON.parse(localStorage.getItem("user")  || "{}");
const users = JSON.parse(localStorage.getItem("users") || "[]");

const record = users.find(u => u.uid === user.uid);

// not logged in
if (!user.uid || !record) {
  location.href = BASE_PATH + "login.html";
}

// not approved
if (!record.approved) {
  alert("Your account is not approved by admin yet.");
  localStorage.removeItem("user");
  location.href = BASE_PATH + "login.html";
}

// sync role safely
user.role = record.role;
localStorage.setItem("user", JSON.stringify(user));


/* ======================================================
   ☰ MENU TOGGLE
====================================================== */
function toggleMenu(force){
  if(force === false){
    document.body.classList.remove("menu-open");
  }else{
    document.body.classList.toggle("menu-open");
  }
}


/* ======================================================
   🚀 INIT MENU (CALL AFTER menu.html LOAD)
====================================================== */
function initMenu(){

  const btn     = document.getElementById("menuBtn");
  const overlay = document.getElementById("overlay");

  btn && btn.addEventListener("click", ()=>toggleMenu());
  overlay && overlay.addEventListener("click", ()=>toggleMenu(false));

  /* 🔗 NAVIGATION */
  document.querySelectorAll("#sidebar a[data-go]").forEach(a=>{
    a.addEventListener("click", ()=>{
      const page = a.dataset.go;
      if(page){
        location.href = BASE_PATH + page;
      }
    });
  });

  /* 📍 ACTIVE PAGE */
  const page = location.pathname.split("/").pop();
  document.querySelectorAll("#sidebar a[data-page]").forEach(a=>{
    if(page && page.includes(a.dataset.page)){
      a.classList.add("active");
    }
  });

  /* 🏷 USER BADGE */
  const badge = document.getElementById("userBadge");
  if(badge){
    badge.textContent =
      user.name + (user.role === "admin" ? " (Admin)" : " (Staff)");
  }

  /* 🚪 LOGOUT */
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn && logoutBtn.addEventListener("click", ()=>{
    if(confirm("Are you sure you want to logout?")){
      localStorage.removeItem("user");
      location.href = BASE_PATH + "login.html";
    }
  });

  document.body.classList.remove("menu-open");
}
