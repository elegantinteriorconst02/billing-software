function getProjects(){
  return JSON.parse(localStorage.getItem("projects")||"[]");
}
function saveProjects(p){
  localStorage.setItem("projects",JSON.stringify(p));
}
