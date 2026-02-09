// 🔑 Base path detect
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

  /* 🔗 Navigation */
  document.querySelectorAll("#sidebar a[data-go]").forEach(a=>{
    a.addEventListener("click", ()=>{
      location.href = BASE_PATH + a.dataset.go;
    });
  });

  /* 📍 Active highlight */
  const page = location.pathname.split("/").pop();
  document.querySelectorAll("#sidebar a[data-page]").forEach(a=>{
    if(page.includes(a.dataset.page)){
      a.classList.add("active");
    }
  });

  /* 👤 User badge */
  const user = JSON.parse(localStorage.getItem("user")||"{}");
  if(!user.uid){
    location.href = BASE_PATH + "login.html";
    return;
  }

  const badge = document.getElementById("userBadge");
  if(badge){
    badge.textContent =
      user.name + (user.role==="admin" ? " (Admin)" : " (Staff)");
  }

  /* 🚪 Logout */
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn && logoutBtn.addEventListener("click", ()=>{
    if(confirm("Logout?")){
      localStorage.removeItem("user");
      location.href = BASE_PATH + "login.html";
    }
  });

  document.body.classList.remove("menu-open");
}
