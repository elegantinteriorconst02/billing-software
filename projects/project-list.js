const rows = document.getElementById("rows");

function render(){
  rows.innerHTML = "";
  getProjects().forEach(p=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.client}</td>
      <td>${p.status}</td>
      <td>
        <button onclick="openProject('${p.id}')">View</button>
      </td>
    `;
    rows.appendChild(tr);
  });
}

function addProject(){
  createProject({
    name: pName.value,
    client: pClient.value
  });
  pName.value="";
  pClient.value="";
  render();
}

function openProject(id){
  location.href = "project-view.html?id=" + id;
}

render();
