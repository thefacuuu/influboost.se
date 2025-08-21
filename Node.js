// server.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const API_KEY = '16580f1f08aceba6ed2149caee728adb';
const SMMSAT_URL = 'https://smmsat.com/api/v2';

// Traer servicios de SMMSAT
app.get('/services', async (req, res) => {
  try {
    const response = await fetch(SMMSAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: API_KEY, action: 'services' })
    });
    const data = await response.json();
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Traer dólar blue actualizado
app.get('/dolar', async (req,res)=>{
  try {
    const response = await fetch('https://api.bluelytics.com.ar/v2/latest');
    const data = await response.json();
    res.json({ blue: data.blue.value_sell });
  } catch(e){ res.status(500).json({error:e.message}); }
});

app.listen(PORT, ()=>console.log(`Servidor corriendo en puerto ${PORT}`));
