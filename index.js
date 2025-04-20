const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors()); // Habilita CORS para todas las rutas
app.use(bodyParser.json()); // Permite recibir JSON

// Rutas
const chatGPTRoutes = require("./routes/chatGPT");
app.use("/chatGPT", chatGPTRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Puerto dinámico para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
