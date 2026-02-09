function getProjects(){
  return JSON.parse(localStorage.getItem("projects")||"[]");
}
function saveProjects(arr){
  localStorage.setItem("projects", JSON.stringify(arr));
}

