const KEY = "projects";

function getProjects(){
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

function saveProjects(data){
  localStorage.setItem(KEY, JSON.stringify(data));
}

function addProject(p){
  const list = getProjects();
  list.push(p);
  saveProjects(list);
}

function getProjectById(id){
  return getProjects().find(p => p.id === id);
}
