const pid = new URLSearchParams(location.search).get("id");
const projects = getProjects();
const project = projects.find(p=>p.id===pid);
let balance = 0;

status.value = project.status;

function renderLedger(){
  ledger.innerHTML="";
  balance = 0;

  project.ledger.forEach(l=>{
    if(l.type==="in") balance += l.amount;
    else balance -= l.amount;

    const tr=document.createElement("tr");
    tr.innerHTML=`
      <td>${l.time}</td>
      <td>${l.note}</td>
      <td>${l.type==="in"?l.amount:""}</td>
      <td>${l.type==="out"?l.amount:""}</td>
      <td>${balance}</td>
    `;
    ledger.appendChild(tr);
  });
}

function openForm(type){
  const amount = Number(prompt("Amount"));
  const note   = prompt("Note");
  const time   = prompt("Date & time", new Date().toISOString().slice(0,16));

  project.ledger.push({
    id:"t_"+Date.now(),
    type,
    amount,
    note,
    time
  });

  saveProjects(projects);
  renderLedger();
}

function changeStatus(s){
  project.status=s;
  saveProjects(projects);
}

renderLedger();
