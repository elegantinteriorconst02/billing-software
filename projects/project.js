function setProjectStatus(id, status){
  updateProject(id, p => p.status = status);
}

function getAllProjects(){
  return loadProjects();
}
