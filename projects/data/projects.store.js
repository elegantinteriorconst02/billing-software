const STORE_KEY = "projects_v1";

function getProjects(){
  return JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
}

function saveProjects(data){
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

function createProject(p){
  const list = getProjects();
  list.push({
    id: "p_"+Date.now(),
    name: p.name,
    client: p.client,
    address: p.address || "",
    phone: p.phone || "",
    status: "running", // running | pause | closed
    createdAt: new Date().toISOString(),
    ledger: [] // 🔥 CASHBOOK
  });
  saveProjects(list);
}
