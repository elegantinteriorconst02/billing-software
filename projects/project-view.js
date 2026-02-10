const pid=new URLSearchParams(location.search).get("id");
let type="in";

function openTxn(t){
  type=t;
  txnBox.style.display="block";
  date.value=new Date().toISOString().slice(0,10);
  time.value=new Date().toTimeString().slice(0,5);
}

function saveTxn(){
  addTxn(pid,{
    type,
    amount:Number(amt.value),
    note:note.value,
    date:date.value,
    time:time.value
  });
  txnBox.style.display="none";
  render();
}

function updateStatus(){
  setProjectStatus(pid,status.value);
}

function render(){
  const p=getProject(pid);
  title.innerText=p.name;
  status.value=p.status;

  ledger.innerHTML="";
  p.transactions.forEach(t=>{
    ledger.innerHTML+=`
      <li class="${t.type}">
        ${t.date} ${t.time} —
        ${t.type==="in"?"＋":"−"}₹${t.amount}
        (${t.note||""})
      </li>`;
  });

  bal.innerText=projectBalance(p);
}
render();
