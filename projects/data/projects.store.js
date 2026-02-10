const PROJECT_KEY = "projects";

function loadProjects(){
  return JSON.parse(localStorage.getItem(PROJECT_KEY) || "[]");
}

function saveProjects(list){
  localStorage.setItem(PROJECT_KEY, JSON.stringify(list));
}

function createProject(data){
  const list = loadProjects();
  list.push({
    id: "p_" + Date.now(),
    name: data.name,
    client: data.client,
    status: "running",
    createdAt: new Date().toISOString(),
    transactions: []
  });
  saveProjects(list);
}

function getProject(id){
  return loadProjects().find(p => p.id === id);
}

function updateProject(id, updater){
  const list = loadProjects();
  const p = list.find(x => x.id === id);
  if(p) updater(p);
  saveProjects(list);
}
