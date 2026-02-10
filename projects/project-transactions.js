const pid = new URLSearchParams(location.search).get("id");
const projects = getProjects();
const project = projects.find(p=>p.id===pid);

document.getElementById("projectTitle").innerText = project.name;
clientName.innerText = project.client || "-";
status.innerText = project.status;

function render(){
  let inc=0, exp=0;
  rows.innerHTML="";
  (project.entries||[]).forEach(e=>{
    if(e.type==="income") inc+=e.amount;
    else exp+=e.amount;

    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${e.date}</td><td>${e.type}</td><td>${e.amount}</td><td>${e.note}</td>`;
    rows.appendChild(tr);
  });
  income.innerText=inc;
  expense.innerText=exp;
  balance.innerText=inc-exp;
}

function addEntry(){
  project.entries = project.entries || [];
  project.entries.push({
    type:type.value,
    amount:+amount.value,
    note:note.value,
    date:new Date().toLocaleDateString()
  });
  saveProjects(projects);
  render();
}

render();
