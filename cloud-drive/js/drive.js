const userKey = localStorage.getItem("currentUser");
if(!userKey) location.href="index.html";

let user = JSON.parse(localStorage.getItem(userKey));
let view="drive", path=[];
const grid = document.getElementById("grid");

function save(){
  localStorage.setItem(userKey, JSON.stringify(user));
}

function currentFolder(){
  let ref = user.files;
  path.forEach(i => ref = ref[i].children);
  return ref;
}

function render(){
  grid.innerHTML="";
  let list =
    view==="trash"? user.trash :
    view==="starred"? user.files.filter(f=>f.star) :
    view==="recent"? user.recent :
    currentFolder();

  list.forEach((f,i)=>{
    const card=document.createElement("div");
    card.className="card"+(f.star?" star":"");

    card.onclick=()=>{
      if(f.type==="folder"){
        path.push(i); render();
      }else preview(f);
    };

    card.oncontextmenu=e=>{
      e.preventDefault();
      if(view==="trash"){
        if(confirm("Restore?")){ user.files.push(f); user.trash.splice(i,1); }
      }else{
        user.trash.push(f);
        list.splice(i,1);
      }
      save(); render();
    };

    card.innerHTML=`
      <img src="assets/${icon(f.type)}">
      <p>${f.name}</p>
    `;
    grid.appendChild(card);
  });

  breadcrumb.innerText="My Drive"+path.map(()=> " > Folder").join("");
}

function uploadFiles(files){
  Array.from(files).forEach(f=>{
    currentFolder().push({
      name:f.name,
      type:f.type.includes("image")?"image":
           f.type.includes("pdf")?"pdf":
           f.type.includes("video")?"video":"doc",
      star:false
    });
    user.recent.unshift({name:f.name,type:"doc"});
  });
  save(); render();
}

function newFolder(){
  const name=prompt("Folder name");
  if(!name) return;
  currentFolder().push({name,type:"folder",children:[]});
  save(); render();
}

function preview(f){
  previewContent.innerHTML=`<h3>${f.name}</h3>`;
  preview.style.display="block";
}

function closePreview(){ preview.style.display="none"; }

function toggleDark(){
  document.body.classList.toggle("dark");
}

function logout(){
  localStorage.removeItem("currentUser");
  location.href="index.html";
}

function setView(v){ view=v; render(); }

function icon(t){
  return {
    folder:"folder.png",
    image:"image.png",
    pdf:"pdf.png",
    video:"video.png",
    doc:"doc.png"
  }[t];
}

render();