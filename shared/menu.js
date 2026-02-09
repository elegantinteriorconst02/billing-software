// 🔑 Base path detect (GitHub Pages + Local)
const BASE_PATH = location.pathname.includes("/billing-software/")
  ? "/billing-software/"
  : "/";

/* ☰ MENU TOGGLE */
function toggleMenu(force){
  if(force === false){
    document.body.classList.remove("menu-open");
  }else{
    document.body.classList.toggle("menu-open");
  }
}

/* 🚀 INIT MENU */
function initMenu(){

  const btn = document.getElementById("menuBtn");
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

  /* 📍 ACTIVE PAGE HIGHLIGHT */
  const page = location.pathname.split("/").pop();
  document.querySelectorAll("#sidebar a[data-page]").forEach(a=>{
    if(page && page.includes(a.dataset.page)){
      a.classList.add("active");
    }
  });

  /* 👤 USER SESSION CHECK */
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if(!user.uid){
    location.href = BASE_PATH + "login.html";
    return;
  }

  /* 🏷 USER BADGE SHOW */
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

  /* 🧹 MENU RESET */
  document.body.classList.remove("menu-open");
}
