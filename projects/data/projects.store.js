const STORE_KEY = "projects-data";

function getProjects(){
  return JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
}

function saveProjects(list){
  localStorage.setItem(STORE_KEY, JSON.stringify(list));
}

function getProject(id){
  return getProjects().find(p => p.id === id);
}

function saveProject(project){
  const list = getProjects();
  const i = list.findIndex(p => p.id === project.id);
  if(i >= 0) list[i] = project;
  else list.push(project);
  saveProjects(list);
}
