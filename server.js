require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Sirve archivos estáticos

const API_KEY = process.env.SMMSAT_API_KEY || '16580f1f08aceba6ed2149caee728adb';
const SMMSAT_URL = process.env.SMMSAT_API_URL || 'https://smmsat.com/api/v2';

// Ruta para obtener servicios del panel SMM SAT
app.post('/api/services', async (req, res) => {
  try {
    const response = await fetch(SMMSAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: API_KEY, action: 'services' })
    });
    const data = await response.json();
    console.log('Respuesta SMM SAT:', data); // Log para depuración
    if (data.error) {
      return res.status(400).json({ error: data.error });
    }
    res.json(data);
  } catch (e) {
    console.error('Error al obtener servicios:', e.message);
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
});

// Ruta para obtener dólar blue
app.get('/api/dolar', async (req, res) => {
  try {
    const response = await fetch('https://api.bluelytics.com.ar/v2/latest');
    const data = await response.json();
    res.json({ blue: data.blue.value_sell });
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener dólar blue' });
  }
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));