const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
require("dotenv").config();

// Asegúrate de que la variable de entorno en tu .env se llame, por ejemplo, CHATGPT_API_KEY
const openAIClient = new OpenAI({
  apiKey: process.env.CHATGPT_API_KEY
});

router.post("/", async (req, res) => {
  const { texto_usuario } = req.body;
  const prompt = `
Extrae la información clave del siguiente texto financiero:
"${texto_usuario}"

Devuelve un JSON con los siguientes campos:
- "tipo_tasa": "nominal" o "efectiva" (las tasas vencidas son efectivas)
- "valor_tasa": número en porcentaje
- "periodo": "diaria", "semanal" , "mensual", "bimestral" ,"trimestral", "semestral", "anual", etc.
- "capitalización": "mensual", "anual", etc. (si la tasa es efectiva, poner null)
- "monto": número en la moneda indicada
- "plazo": cantidad de tiempo 
- "unidad_tiempo": "mes", "año", "día", etc.
`;

  try {
    const response = await openAIClient.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "Eres un asistente financiero experto en tasas de interés." },
        { role: "user", content: prompt }
      ]
    });

    const respuestaTexto = response.choices[0].message.content;

    // Eliminamos los bloques markdown si existen
    const respuestaSinFences = respuestaTexto
    .replace(/```(json)?\n?/, '')
    .replace(/\n?```/, '')
    .trim();

    let resultado;
    try {
      resultado = JSON.parse(respuestaSinFences);
    } catch (parseError) {
      return res.status(500).json({
        error: "No se pudo parsear la respuesta a JSON",
        rawResponse: respuestaTexto
      });
    }

    res.json(resultado);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;