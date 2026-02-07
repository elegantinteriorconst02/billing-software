// 🔑 Base path detect
const BASE_PATH = location.pathname.includes("/billing-software/")
  ? "/billing-software/"
  : "/";

// ☰ Menu toggle
function toggleMenu(force) {
  if (force === false) {
    document.body.classList.remove("menu-open");
  } else {
    document.body.classList.toggle("menu-open");
  }
}

// 🚀 Init menu
function initMenu() {
  const btn = document.getElementById("menuBtn");
  const overlay = document.getElementById("overlay");

  btn && btn.addEventListener("click", () => toggleMenu());
  overlay && overlay.addEventListener("click", () => toggleMenu(false));

  // ✅ Sidebar navigation (MAIN FIX)
  document.querySelectorAll("#sidebar a[data-go]").forEach(a => {
    a.addEventListener("click", () => {
      const page = a.getAttribute("data-go");
      location.href = BASE_PATH + page;
    });
  });

  // 🔓 Logout
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn && logoutBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      location.href = BASE_PATH + "login.html";
    }
  });

  // ✅ Active menu highlight
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#sidebar a[data-page]").forEach(a => {
    if (currentPage.startsWith(a.dataset.page)) {
      a.classList.add("active");
    }
  });

  document.body.classList.remove("menu-open");
}
