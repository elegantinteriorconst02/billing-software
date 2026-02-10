function addTxn(pid, txn){
  updateProject(pid, p=>{
    p.transactions.push({
      id:"t_"+Date.now(),
      ...txn
    });
  });
}

function projectBalance(p){
  return p.transactions.reduce((b,t)=>{
    return t.type==="in" ? b+t.amount : b-t.amount;
  },0);
}
