
projectStatus.value = project.status || "running";

function updateStatus(val){
  project.status = val;
  saveProject(project);
  status.innerText = val;
}



const id = new URLSearchParams(location.search).get("id");
let project = getProject(id);

if(!project){
  alert("Project not found");
  location.href="project-list.html";
}

project.entries = project.entries || [];

projectName.innerText = project.name;
status.innerText = project.status || "running";

let type = "in";

function render(){
 ledger.innerHTML += `
  <div class="entry">
    <div><b>${new Date(e.time).toLocaleString()}</b></div>

    <div class="${e.type==='in'?'green':'red'}">
      ₹ ${e.amount}
    </div>

    <div class="badge">
      ${e.category.toUpperCase()}
      ${e.party ? " • " + e.party : ""}
      • ${e.mode}
    </div>

    <div>${e.note||""}</div>

    ${e.attach?`<div class="attach"><img src="${e.attach}"></div>`:""}

    <div class="badge">Balance: ₹ ${balance}</div>
  </div>
    `;
  });
}

function openForm(t){
  type = t;
  form.style.display="block";
}

function saveEntry(){
  if(project.status==="closed"){
    alert("Project is closed");
    return;
  }

  const reader = new FileReader();
  const file = document.getElementById("file").files[0];

  reader.onload = ()=>{
    project.entries.push({
      id: crypto.randomUUID(),
      type: entryType.value,
      category: category.value,
      party: party.value,
      amount: +amount.value,
      mode: mode.value,
      note: note.value,
      time: Date.now(),
      attach: reader.result || null
    });

    saveProject(project);
    form.style.display="none";
    render();
  };

  if(file) reader.readAsDataURL(file);
  else reader.onload();
}


render();
