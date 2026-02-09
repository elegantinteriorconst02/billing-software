/* ===============================
   PROJECT STORAGE (localStorage)
================================ */

const PROJECT_KEY = "projects";

/* 🔹 GET ALL PROJECTS */
function getProjects(){
  return JSON.parse(localStorage.getItem(PROJECT_KEY) || "[]");
}

/* 🔹 SAVE ALL */
function saveProjects(list){
  localStorage.setItem(PROJECT_KEY, JSON.stringify(list));
}

/* 🔹 CREATE PROJECT */
function createProject(data){
  const list = getProjects();

  const project = {
    id: "p_" + Date.now(),
    name: data.name,
    clientId: data.clientId || "",
    status: "running", // running | paused | pending | closed
    startDate: data.startDate,
    createdAt: new Date().toISOString(),

    incomes: [],   // client payments
    expenses: []   // vendor expenses
  };

  list.push(project);
  saveProjects(list);
  return project;
}

/* 🔹 GET PROJECT BY ID */
function getProject(id){
  return getProjects().find(p => p.id === id);
}

/* 🔹 UPDATE PROJECT */
function updateProject(project){
  const list = getProjects().map(p => p.id === project.id ? project : p);
  saveProjects(list);
}
