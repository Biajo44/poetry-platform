let editingPoemId=null;
let poemToDelete = null;
let currentTag = "";

const home=document.getElementById("home");
const write=document.getElementById("write");
const community=document.getElementById("community");
const book=document.getElementById("book");

const openModal=document.getElementById("open-modal");
const openList=document.getElementById("open-list");
const btnBack=document.getElementById("btn-back");
const btnHome=document.getElementById("btn-home");
const btnHome2=document.getElementById("btn-home-2");
const btnBook=document.getElementById("btn-book");
const btnPublish=document.getElementById("btn-publish");

const counter=document.getElementById("counter");
const titleInput=document.getElementById("title");
const authorInput=document.getElementById("author");
const contentInput=document.getElementById("content");
const errorMsg=document.getElementById("error-msg");
const openTags=document.getElementById("open-tags");
const tagsPanel=document.getElementById("tags-panel");
const tagPreview=document.getElementById("tag-preview");


    // screen change //
function show(section){
  [home,write,community,book].forEach(s=>{
    s.classList.add("opacity-0","pointer-events-none");
  });
  section.classList.remove("opacity-0","pointer-events-none");
}


    // navigation //
openModal.onclick=()=>show(write);
openList.onclick=()=>{show(community);loadCommunity();}
btnBack.onclick=()=>show(home);
btnHome.onclick=()=>show(home);
btnHome2.onclick=()=>show(write);
btnBook.onclick=()=>{show(book);loadBook();}


    // counter //
contentInput.addEventListener("input",()=>{
  const lines=contentInput.value.split("\n").filter(l=>l.trim()!=="");
  counter.innerText=`✦ ${lines.length}`;
});


    // keyword //
contentInput.addEventListener("input", () => {
  const text = contentInput.value.toLowerCase();
  const body = document.body;

 body.classList.remove(
    "from-pink-900","via-rose-900","to-purple-900",
    "from-slate-900","via-gray-900","to-black",
    "from-yellow-700","via-orange-700","to-rose-800",
    "via-purple-950"
  );

  if (text.includes("amor") || text.includes("beijo")) {
    body.classList.add("from-pink-900","via-rose-900","to-purple-900");
  } 
  else if (text.includes("triste") || text.includes("dor")) {
    body.classList.add("from-slate-900","via-gray-900","to-black");
  } 
  else if (text.includes("sol") || text.includes("luz")) {
    body.classList.add("from-yellow-700","via-orange-700","to-rose-800");
  } 
  else {
    body.classList.add("from-slate-900","via-purple-950","to-slate-900");
  }
});


  // error message //
  function showError(msg){
    errorMsg.innerText=msg;
    errorMsg.classList.remove("opacity-0");
    errorMsg.classList.add("opacity-100");

    setTimeout(()=>{
      errorMsg.classList.remove("opacity-100");
      errorMsg.classList.add("opacity-0");
    },3000);
  }


    // tags panel //
let tagsOpen=false;
let selectedTags=[];

openTags.onclick=()=>{
  tagsOpen=!tagsOpen;
  if (tagsOpen) {
    tagsPanel.classList.remove("max-h-0","opacity-0");
    tagsPanel.classList.add("max-h-64","opacity-100");
  } else {
    tagsPanel.classList.remove("max-h-64","opacity-100");
    tagsPanel.classList.add("max-h-0","opacity-0");
  }
};

document.querySelectorAll(".tag-btn").forEach(btn=>{
  btn.onclick=()=>{
    const tag=btn.dataset.tag;
    if (selectedTags.includes(tag)) {
      selectedTags=selectedTags.filter(t=>t!==tag);
      btn.classList.remove("ring-2","ring-white","scale-110");
    } else {
      selectedTags.push(tag);
      btn.classList.add("ring-2","ring-white","scale-110");
    }
    renderTagPreview();
  };
});

function renderTagPreview(){
  tagPreview.innerHTML="";
  selectedTags.forEach(tag=>{
    const btn=document.querySelector(`.tag-btn[data-tag="${tag}"]`);
    const span=document.createElement("span");
    span.innerText="#"+tag;
    span.className=btn.className+"text-xs px-3 py-1 rounded-xl";
    tagPreview.appendChild(span);
  });
}

    // publish // edit //
btnPublish.onclick=()=>{
  const title=titleInput.value.trim();
  const author=authorInput.value.trim()||"Anônimo";
  const content=contentInput.value.trim();

  if (!title&&!content) {
    showError("As estrelas estão vazias... dê vida ao seu poema!✨");
    return;
  }
  if (!title) {
    showError("Seu poema merece um título brilhante!🌙");
    return;
  }
  if (!content) {
    showError("O universo do seu poema está em branco... preencha-o com suas palavras!🌟");
    return;
  }

  let myPoems=JSON.parse(localStorage.getItem("myPoems"))||[];
  let communityPoems=JSON.parse(localStorage.getItem("communityPoems"))||[];

  if (editingPoemId) {
    myPoems=myPoems.map(p=>p.id===editingPoemId ? {...p,title,author,content,tags:selectedTags} : p);
    communityPoems=communityPoems.map(p=>p.id===editingPoemId ? {...p,title,author,content,tags:selectedTags} : p);
    editingPoemId=null;
  } else {
  const poem={
    id: Date.now(),
    title,
    author,
    content,
    tags: selectedTags,
    date:new Date().toLocaleDateString(),
    likes:0
  };
   myPoems.push(poem);
    communityPoems.push(poem);
  }
  localStorage.setItem("myPoems",JSON.stringify(myPoems));
  localStorage.setItem("communityPoems",JSON.stringify(communityPoems));

    // to clear //
  titleInput.value="";
  authorInput.value="";
  contentInput.value="";
  counter.innerText="✦ 0";
  selectedTags=[];
  renderTagPreview();
  
  show(book);
  loadBook();
};


    // community //
function loadCommunity(){
  const list = document.getElementById("community-list");
  const poems = JSON.parse(localStorage.getItem("communityPoems")) || [];
  const likedPoems = JSON.parse(localStorage.getItem("likedPoems")) || [];

  list.innerHTML = "";

  poems.forEach(p => {
    const liked = likedPoems.includes(p.id);

    list.innerHTML += `
      <div class="border-b pb-2">
        <h3 class="font-bold">${p.title}</h3>
        <p class="text-sm opacity-70">${p.author} | ${p.date}</p>
        <p class="mt-2 whitespace-pre-line">${p.content}</p>
        <div class="flex flex-wrap gap-2 mt-2">
          ${(p.tags||[]).map(tag=>`<span class="px-2 py-1 text-xs rounded-xl bg-purple-700/40">${tag}</span>`).join("")}
        </div>
        <button onclick="likePoem(${p.id})">
          ${liked ? "❤️" : "🤍"} ${p.likes}
        </button>
      </div>
    `;
  });       
}

    // filter, search, sort //
function setTagFilter(tag){
  currentTag = tag;
  renderCommunity();
}

function renderCommunity(){
  const list = document.getElementById("community-list");
  const poems = JSON.parse(localStorage.getItem("communityPoems")) || [];
  const likedPoems = JSON.parse(localStorage.getItem("likedPoems")) || [];
  const search = document.getElementById("search-input").value.toLowerCase();
  const sort = document.getElementById("sort-select").value;

  let filtered = poems.filter(p => {
    const matchSearch =
      p.title.toLowerCase().includes(search) ||
      p.content.toLowerCase().includes(search);

    const matchTag =
      currentTag === "" || (p.tags || []).includes(currentTag);

    return matchSearch && matchTag;
  });

  if (sort === "likes") {
    filtered.sort((a,b)=> b.likes - a.likes);
  } else {
    filtered.sort((a,b)=> b.id - a.id);
  }

  list.innerHTML = "";

  filtered.forEach(p=>{
    const liked = likedPoems.includes(p.id);
    const preview = p.content.slice(0,120) + "...";

    list.innerHTML += `
      <div class="border-b pb-3 fade-in">
        <h3 class="font-bold text-lg">${p.title}</h3>
        <p class="text-sm opacity-70">${p.author} • ${p.date}</p>

        <p class="mt-2">${preview}</p>

        <div class="flex flex-wrap gap-2 mt-2">
          ${(p.tags||[]).map(tag=>`
            <span class="px-2 py-1 text-xs rounded-xl bg-purple-700/40">
              #${tag}
            </span>
          `).join("")}
        </div>

        <div class="flex justify-between items-center mt-2">
          <button onclick="openPoem(${p.id})" class="text-purple-400">
            Ler mais
          </button>

          <button onclick="likePoem(${p.id})">
            ${liked ? "❤️" : "🤍"} ${p.likes}
          </button>
        </div>
      </div>
    `;
  });
}


function openPoem(id){
  const poems = JSON.parse(localStorage.getItem("communityPoems")) || [];
  const poem = poems.find(p=>p.id===id);
  if(!poem) return;

  document.getElementById("modal-title").innerText = poem.title;
  document.getElementById("modal-author").innerText = poem.author;
  document.getElementById("modal-content").innerText = poem.content;

  const modal = document.getElementById("poem-modal");
  modal.classList.remove("opacity-0","pointer-events-none");
}

function closePoem(){
  const modal = document.getElementById("poem-modal");
  modal.classList.add("opacity-0","pointer-events-none");
}


    // my universe //
function loadBook(){
  const list=document.getElementById("book-list");
  const poems=JSON.parse(localStorage.getItem("myPoems"))||[];
  list.innerHTML="";

  poems.forEach(p=>{
    list.innerHTML+=`
      <div class="border-b pb-2">
        <h3 class="font-bold">${p.title}</h3>
        <p class="text-sm opacity-70">${p.author} | ${p.date}</p>
        <p class="mt-2 whitespace-pre-line">${p.content}</p>
        <div class="flex flex-wrap gap-2 mt-2">
          ${(p.tags||[]).map(tag=>`<span class="px-2 py-1 text-xs rounded-xl bg-purple-700/40">${tag}</span>`).join("")}
        </div>
        <div class="flex gap-3 mt-3">
        <button onclick="editPoem(${p.id})" class="text-blue-400">✏️ Reescrever</button>
        <button onclick="openDeleteModal(${p.id})" class="text-red-400">🌑 Apagar estrela</button>
        </div>
      </div>
    `;
  });
}

    // edit poem //
function editPoem(id){
  const myPoems=JSON.parse(localStorage.getItem("myPoems"))||[];
  const poem=myPoems.find(p=>p.id===id);

  if (!poem) return;
  editingPoemId=id;
  titleInput.value=poem.title;
  authorInput.value=poem.author;
  contentInput.value=poem.content;
  selectedTags=poem.tags||[];
  renderTagPreview();

  document.querySelectorAll(".tag-btn").forEach(btn=>{
    btn.classList.remove("ring-2","ring-white","scale-110");
    btn.classList.toggle("ring-2",selectedTags.includes(btn.dataset.tag));
  });
  show(write);
}

    // delete poem //
function openDeleteModal(id){
  poemToDelete = id;
  document.getElementById("delete-modal").classList.remove("opacity-0","pointer-events-none");
}

function closeDeleteModal(){
   poemToDelete = null;
  document.getElementById("delete-modal").classList.add("opacity-0","pointer-events-none");
}

function confirmDeletePoem(){
  let myPoems = JSON.parse(localStorage.getItem("myPoems")) || [];
  let communityPoems = JSON.parse(localStorage.getItem("communityPoems")) || [];

  myPoems = myPoems.filter(p => p.id !== poemToDelete);
  communityPoems = communityPoems.filter(p => p.id !== poemToDelete);

  localStorage.setItem("myPoems", JSON.stringify(myPoems));
  localStorage.setItem("communityPoems", JSON.stringify(communityPoems));

  closeDeleteModal();
  loadBook();
}



    // likes //
function likePoem(id) {
  let poems = JSON.parse(localStorage.getItem("communityPoems")) || [];
  let myPoems = JSON.parse(localStorage.getItem("myPoems")) || [];
  let likedPoems = JSON.parse(localStorage.getItem("likedPoems")) || [];

  const index = poems.findIndex(p => p.id === id);
  if (index === -1) return;

  if (likedPoems.includes(id)) {
    poems[index].likes--;
    likedPoems = likedPoems.filter(pid => pid !== id);
  } else {
    poems[index].likes++;
    likedPoems.push(id);
  }

  myPoems=myPoems.map(p=>p.id===id ? {...p,likes:poems[index].likes} : p);

  localStorage.setItem("myPoems", JSON.stringify(myPoems));
  localStorage.setItem("communityPoems", JSON.stringify(poems));
  localStorage.setItem("likedPoems", JSON.stringify(likedPoems));
  loadCommunity();
}