require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para interpretar JSON e servir arquivos estáticos da pasta 'public'
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Inicializa o cliente do Gemini usando a chave do .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Rota POST /chat
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'A mensagem não pode estar vazia.' });
    }

    // Chamada à API do Gemini
    
      let response;

for (let tentativa = 1; tentativa <= 3; tentativa++) {
  try {
    response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: message,
      config: {
        systemInstruction:
      "Você é uma atendente virtual de uma loja fitness. Responda sempre em português do Brasil, de forma curta, simples e educada. Não invente produtos, cores, tamanhos ou estoque. Se não souber, diga que vai confirmar."
      }
    });

    break;
  } catch (error) {
    if (error.status === 503 && tentativa < 3) {
      await new Promise(resolve =>
        setTimeout(resolve, tentativa * 2000)
      );
    } else {
      throw error;
    }
  }
}

    return res.json({ response: response.text });
  } catch (error) {
    console.error('Erro ao chamar a Gemini API:', error);
    return res.status(500).json({ error: 'Erro interno ao processar sua solicitação.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});