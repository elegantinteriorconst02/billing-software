// 🔑 Base path detect (GitHub Pages + Local)
const BASE_PATH = location.pathname.includes("/billing-software/")
  ? "/billing-software/"
  : "/";

function toggleMenu(force){
  if(force === false){
    document.body.classList.remove("menu-open");
  }else{
    document.body.classList.toggle("menu-open");
  }
}

function initMenu(){
  const btn = document.getElementById("menuBtn");
  const overlay = document.getElementById("overlay");

  btn && btn.addEventListener("click", ()=>toggleMenu());
  overlay && overlay.addEventListener("click", ()=>toggleMenu(false));

  /* 🔗 navigation */
  document.querySelectorAll("#sidebar a[data-go]").forEach(a=>{
    a.addEventListener("click", ()=>{
      const page = a.dataset.go;
      if(page){
        location.href = BASE_PATH + page;
      }
    });
  });

  /* 📍 active page */
  const page = location.pathname.split("/").pop();
  document.querySelectorAll("#sidebar a[data-page]").forEach(a=>{
    if(page && page.includes(a.dataset.page)){
      a.classList.add("active");
    }
  });

  /* 🚪 logout */
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn && logoutBtn.addEventListener("click", ()=>{
    if(confirm("Are you sure you want to logout?")){
      localStorage.removeItem("user");
      location.href = BASE_PATH + "login.html";
    }
  });

  /* 👤 USER + ROLE CHECK */
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  if(!user.uid){
    location.href = BASE_PATH + "login.html";
    return;
  }

  /* 🏷 USER BADGE */
  const badge = document.getElementById("userBadge");
  if(badge){
    badge.textContent =
      user.name + (user.role === "admin" ? " (Admin)" : " (Staff)");
  }

  /* 🔒 admin-only hide */
  if(user.role !== "admin"){
    document.querySelectorAll(".admin-only").forEach(el=>{
      el.style.display = "none";
    });
  }

  document.body.classList.remove("menu-open");
}
