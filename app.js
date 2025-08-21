// ===== Fondo cohetes =====
const canvas = document.createElement('canvas');
document.getElementById('rocket-bg').appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let rockets = [];

function random(min,max){ return Math.random()*(max-min)+min; }

class Rocket {
  constructor(){
    this.x = random(50, canvas.width-50);
    this.y = canvas.height + 10;
    this.vy = random(3,6);
    this.size = random(3,6);
    this.color = `hsl(${random(0,360)},100%,70%)`;
  }
  update(){
    this.y -= this.vy;
    if(this.y < -10){
      this.y = canvas.height + 10;
      this.x = random(50, canvas.width-50);
      this.vy = random(3,6);
      this.size = random(3,6);
      this.color = `hsl(${random(0,360)},100%,70%)`;
    }
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fillStyle=this.color;
    ctx.fill();
  }
}

for(let i=0;i<60;i++) rockets.push(new Rocket());

function animateRockets(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  rockets.forEach(r => { r.update(); r.draw(); });
  requestAnimationFrame(animateRockets);
}
animateRockets();

window.addEventListener('resize', ()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// ===== Servicios =====
let allServices = [];
let dollarBlue = 0;

async function getDollarBlue(){
  const res = await fetch("http://localhost:3000/dolar");
  const data = await res.json();
  return data.blue;
}

async function getServices(){
  const res = await fetch("http://localhost:3000/services");
  return await res.json();
}

function renderMenu(services){
  const menuDiv = document.getElementById("menu");
  menuDiv.innerHTML = "";
  if(services.length === 0){
    menuDiv.innerHTML = "<p style='text-align:center; color:#fff;'>No se encontraron servicios 😢</p>";
    return;
  }
  services.forEach(service=>{
    const priceUSD = service.rate/1000;
    const priceARS = Math.round(priceUSD*2*dollarBlue);
    const card = document.createElement("div");
    card.className="card";
    card.innerHTML=`
      <h3>${service.name}</h3>
      <p><b>Red:</b> ${service.network}</p>
      <p><b>Precio 1000:</b> $${priceARS.toLocaleString("es-AR")} ARS</p>
      <p><b>Min:</b> ${service.min} | <b>Max:</b> ${service.max}</p>
    `;
    menuDiv.appendChild(card);
  });
}

function applyFilters(){
  const search = document.getElementById("search").value.toLowerCase();
  const network = document.getElementById("filter-social").value;
  const filtered = allServices.filter(s=>{
    const matchNetwork = network ? s.network===network : true;
    const matchSearch = s.name.toLowerCase().includes(search);
    return matchNetwork && matchSearch;
  });
  renderMenu(filtered);
}

async function init(){
  document.getElementById("menu").innerHTML = "<p style='text-align:center; color:#fff;'>Cargando servicios...</p>";
  [dollarBlue, allServices] = await Promise.all([getDollarBlue(), getServices()]);
  renderMenu(allServices);
  document.getElementById("search").addEventListener("input", applyFilters);
  document.getElementById("filter-social").addEventListener("change", applyFilters);
}

init();
