require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const open = require('open');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const API_KEY = process.env.OPENROUTER_API_KEY;
if (!API_KEY?.trim()) {
    console.error("\nERRO: A variável de ambiente OPENROUTER_API_KEY não foi definida no arquivo .env");
    console.error("Por favor, crie um arquivo .env e adicione sua chave da OpenRouter.\n");
    process.exit(1);
}


const BASE_API_URL = 'https://openrouter.ai/api/v1';

app.post('/api/generate', async (req, res) => {
    try {
        const url = `${BASE_API_URL}/chat/completions`;
        const headers = {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        };
        const data = {
            model: req.body.model || "openai/gpt-oss-20b:free",
            messages: req.body.messages
        };
        const response = await axios.post(url, data, { headers });
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao chamar a API de Geração:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({ error: 'Falha ao chamar a API do OpenRouter' });
    }
});

app.listen(port, () => {
    console.log(`\nServidor proxy rodando em http://localhost:${port}`);
    console.log(`Acesse sua aplicação em http://localhost:${port}/perguntas.html\n`);
});
