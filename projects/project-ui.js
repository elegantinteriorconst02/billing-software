
/* ===============================
   PROJECT UI
================================ */

function renderProjects(){
  const tbody = document.getElementById("projectRows");
  const filter = document.getElementById("statusFilter").value;

  tbody.innerHTML = "";

  getProjects()
    .filter(p => !filter || p.status === filter)
    .forEach(p=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.name}</td>
        <td>${p.client || "-"}</td>
        <td>${p.status}</td>
        <td>
          <button onclick="openProject('${p.id}')">View</button>
          <button onclick="change('${p.id}','closed')">Close</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
}

function addNewProject(){
  const name = projectName.value;
  const client = projectClient.value;

  createProject(name, client);
  projectName.value="";
  projectClient.value="";

  renderProjects();
}

function change(id,status){
  changeProjectStatus(id,status);
  renderProjects();
}

function openProject(id){
  location.href = "project-details.html?id=" + id;
}
