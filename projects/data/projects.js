
/* ===============================
   PROJECT STORAGE (localStorage)
================================ */
const PROJECT_KEY = "projects";

function getProjects(){
  return JSON.parse(localStorage.getItem(PROJECT_KEY) || "[]");
}

function saveProjects(list){
  localStorage.setItem(PROJECT_KEY, JSON.stringify(list));
}

function addProject(project){
  const list = getProjects();
  list.push(project);
  saveProjects(list);
}

function updateProject(id, data){
  const list = getProjects().map(p =>
    p.id === id ? { ...p, ...data } : p
  );
  saveProjects(list);
}

function getProjectById(id){
  return getProjects().find(p => p.id === id);
}
