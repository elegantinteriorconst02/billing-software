const box = document.getElementById("projectList");

function render(){
  const projects = getProjects();
  box.innerHTML = "";

  projects.forEach(p=>{
    box.innerHTML += `
      <div class="card">
        <b>${p.name}</b><br>
        <small>${p.client}</small><br>
        <span class="badge ${p.status}">${p.status}</span><br><br>
        <button onclick="openProject('${p.id}')">Open</button>
      </div>
    `;
  });
}

function createProject(){
  const name = prompt("Project name?");
  if(!name) return;

  const projects = getProjects();
  projects.push({
    id: Date.now(),
    name,
    client:"",
    status:"running",
    createdAt:new Date().toISOString()
  });
  saveProjects(projects);
  render();
}

function openProject(id){
  location.href = "project-view.html?id=" + id;
}

render();

