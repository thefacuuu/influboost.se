const API_KEY = "63a41386d4c257336bbee98af99f6a5e";
const SMM_API = "https://smmsat.com/api/v2";
const DOLAR_API = "https://api.bluelytics.com.ar/v2/latest"; // mejor para el blue

// Obtener precio del dólar blue
async function getDolarBlue() {
  let res = await fetch(DOLAR_API);
  let data = await res.json();
  return data.blue.value_avg; // valor promedio
}

// Traer servicios de SMMsat
async function getServices() {
  let formData = new FormData();
  formData.append("key", API_KEY);
  formData.append("action", "services");

  let res = await fetch(SMM_API, {
    method: "POST",
    body: formData
  });

  return await res.json();
}

// Renderizar servicios
async function renderServices() {
  const dolarBlue = await getDolarBlue();
  const services = await getServices();

  services.forEach(service => {
    let priceUSD = parseFloat(service.rate); 
    let finalPrice = priceUSD * 2 * dolarBlue; 

    let card = document.createElement("div");
    card.className = "service-card";
    card.innerHTML = `
      <h3>${service.name}</h3>
      <p>Cantidad mínima: ${service.min}</p>
      <p>Cantidad máxima: ${service.max}</p>
      <p><strong>Precio: $${finalPrice.toFixed(2)} ARS</strong></p>
    `;

    if (service.category.includes("Instagram")) {
      document.getElementById("insta-services").appendChild(card);
    } else if (service.category.includes("Facebook")) {
      document.getElementById("fb-services").appendChild(card);
    } else if (service.category.includes("TikTok")) {
      document.getElementById("tiktok-services").appendChild(card);
    } else if (service.category.includes("YouTube")) {
      document.getElementById("yt-services").appendChild(card);
    }
  });
}

// Ejecutar al cargar
renderServices();
