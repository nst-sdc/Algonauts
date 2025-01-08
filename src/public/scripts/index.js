const potd = document.querySelector("#potd"); 
const archive = document.querySelector("#archive"); 

const  createProblemRow = async (problemData) => {
const statics = await sendFetchRequest(`/problems/getsolvecount?contestId=${problemData.contestId}&problemIndex=${problemData.problemIndex}`)
console.log(problemData);

const tr = document.createElement("tr");

const problemCell = document.createElement("td");
problemCell.className = "problem";
const problemLink = document.createElement("a");
problemLink.href = problemData.url;
problemLink.textContent = problemData.name;
problemCell.appendChild(problemLink);
tr.appendChild(problemCell);


const info = document.createElement("td") ;
info.className = "info"
info.innerText = `${statics.totalSolve-statics.participantSolve}/${statics.participantSolve}/${statics.totalSolve}`
tr.appendChild(info)
const tagsCell1 = document.createElement("td");
tagsCell1.className = "tags";

problemData.tags.forEach((tag) => {
  const span = document.createElement("span");
  span.className = "tag";
  span.textContent = tag;
  tagsCell1.appendChild(span);
});
tr.appendChild(tagsCell1);

const tagsCell2 = document.createElement("td");
tagsCell2.className = "tags";
const span = document.createElement("span");
span.className = "tag";
span.textContent = problemData.difficulty;
tagsCell2.appendChild(span);
tr.appendChild(tagsCell2);

return tr;
}


(async ()=>{

const data = await sendFetchRequest("/problems/getproblems/450005");
potd.innerHTML = "";
archive.innerHTML = "";

await data.forEach(async (elem) =>{
  const tmpRow = await createProblemRow(elem)
  if(elem.date == getFormatedDate(new Date()) ){
    potd.appendChild( tmpRow);
  }
  else archive.appendChild(tmpRow);
})

})()
