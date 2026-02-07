// 🔑 Base path detect (GitHub Pages + Local)
const BASE_PATH = location.pathname.includes("/billing-software/")
  ? "/billing-software/"
  : "/";

// 📍 Navigation handler
function go(page) {
  location.href = BASE_PATH + page;
}

// 🔓 Logout (SINGLE, FINAL)
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("user");
    location.href = BASE_PATH + "login.html";
  }
}

// ☰ Sidebar toggle
function toggleMenu(force) {
  if (force === false) {
    document.body.classList.remove("menu-open");
  } else {
    document.body.classList.toggle("menu-open");
  }
}

// 🚀 Init menu after HTML loads
function initMenu() {
  const btn = document.getElementById("menuBtn");
  const overlay = document.getElementById("overlay");

  btn && btn.addEventListener("click", () => toggleMenu());
  overlay && overlay.addEventListener("click", () => toggleMenu(false));

  // ✅ Active menu highlight (FINAL, SAFE)
  const currentPage = location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("#sidebar a[data-page]").forEach(a => {
    if (currentPage.startsWith(a.dataset.page)) {
      a.classList.add("active");
    }
  });

  // reset menu state
  document.body.classList.remove("menu-open");
}
