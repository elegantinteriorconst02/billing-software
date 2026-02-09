/* ===============================
   PROJECT SERVICE
================================ */

function createProject(name, client){
  if(!name) return alert("Project name required");

  addProject({
    id: "P" + Date.now(),
    name,
    client,
    status: "running", // running | pending | closed
    budget: 0,
    createdAt: new Date().toISOString()
  });
}

function changeProjectStatus(id, status){
  updateProject(id, { status });
}

