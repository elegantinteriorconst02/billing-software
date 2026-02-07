function toggleMenu(force){
  if(force === false){
    document.body.classList.remove("menu-open");
  }else{
    document.body.classList.toggle("menu-open");
  }
}

/* bind after menu loads */
function initMenu(){
  const btn = document.getElementById("menuBtn");
  const overlay = document.getElementById("overlay");

  btn && btn.addEventListener("click", ()=>toggleMenu());
  overlay && overlay.addEventListener("click", ()=>toggleMenu(false));

  /* active page highlight */
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#sidebar a[data-page]").forEach(a=>{
    if(page.includes(a.dataset.page)){
      a.classList.add("active");
    }
  });

  /* IMPORTANT: reset state on load */
  document.body.classList.remove("menu-open");
}
function logout(){
  if(confirm("Are you sure you want to logout?")){
    localStorage.removeItem("user");
    location.href = "login.html";
  }
}

