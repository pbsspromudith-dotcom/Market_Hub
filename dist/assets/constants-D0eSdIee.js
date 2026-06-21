const a=(e,r)=>{if(r==="free")return"Free";if(r==="contact")return"Please Contact";if(r==="swap")return"Swap / Trade";const t=Number(e);return isNaN(t)?"$0":`$${t.toLocaleString()}`};export{a as f};
