// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // Adicionar o módulo CORS

const app = express();
const PORT = 3001;

// Configurar o middleware para parsing de JSON e CORS
app.use(bodyParser.json());
app.use(cors()); // Adicionar suporte ao CORS

// Função para obter o próximo ID
const getNextId = (perguntas) => {
  const ids = perguntas.map(p => p.id);
  return ids.length ? Math.max(...ids) + 1 : 1; // Se há IDs existentes, retorna o próximo; caso contrário, começa com 1
};

// Rota para obter perguntas
app.get('/api/perguntas', (req, res) => {
  fs.readFile(path.join(__dirname, 'public', 'perguntas.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler o arquivo');
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Rota para criar novas perguntas
app.post('/api/perguntas', (req, res) => {
  const newQuestion = req.body;

  fs.readFile(path.join(__dirname, 'public', 'perguntas.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler o arquivo');
      return;
    }

    const perguntas = JSON.parse(data);
    const nextId = getNextId(perguntas); // Obtém o próximo ID
    const perguntaComID = { ...newQuestion, id: nextId };

    perguntas.push(perguntaComID);

    fs.writeFile(path.join(__dirname, 'public', 'perguntas.json'), JSON.stringify(perguntas, null, 2), 'utf8', (err) => {
      if (err) {
        res.status(500).send('Erro ao salvar o arquivo');
        return;
      }
      res.status(201).json(perguntaComID);
    });
  });
});

// Rota para atualizar uma pergunta existente
app.put('/api/perguntas/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updatedQuestion = req.body;

  fs.readFile(path.join(__dirname, 'public', 'perguntas.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler o arquivo');
      return;
    }

    let perguntas = JSON.parse(data);
    perguntas = perguntas.map(p =>
      p.id === id ? { ...p, ...updatedQuestion } : p
    );

    fs.writeFile(path.join(__dirname, 'public', 'perguntas.json'), JSON.stringify(perguntas, null, 2), 'utf8', (err) => {
      if (err) {
        res.status(500).send('Erro ao salvar o arquivo');
        return;
      }
      res.status(200).json(updatedQuestion);
    });
  });
});

// Inicializar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
