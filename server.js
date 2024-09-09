const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // Adicionar o módulo CORS

const app = express();
const PORT = 3001;

// Configurar o middleware para parsing de JSON e CORS
app.use(express.json()); // Use express.json() em vez de body-parser
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
      console.error('Erro ao ler o arquivo:', err); // Log do erro
      res.status(500).send('Erro ao ler o arquivo');
      return;
    }
    try {
      res.json(JSON.parse(data));
    } catch (parseErr) {
      console.error('Erro ao parsear o JSON:', parseErr); // Log do erro
      res.status(500).send('Erro ao processar o JSON');
    }
  });
});

// Rota para criar novas perguntas
app.post('/api/perguntas', (req, res) => {
  const newQuestion = req.body;

  fs.readFile(path.join(__dirname, 'public', 'perguntas.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err); // Log do erro
      res.status(500).send('Erro ao ler o arquivo');
      return;
    }

    try {
      const perguntas = JSON.parse(data);
      const nextId = getNextId(perguntas); // Obtém o próximo ID
      const perguntaComID = { ...newQuestion, id: nextId };

      perguntas.push(perguntaComID);

      fs.writeFile(path.join(__dirname, 'public', 'perguntas.json'), JSON.stringify(perguntas, null, 2), 'utf8', (err) => {
        if (err) {
          console.error('Erro ao salvar o arquivo:', err); // Log do erro
          res.status(500).send('Erro ao salvar o arquivo');
          return;
        }
        res.status(201).json(perguntaComID);
      });
    } catch (parseErr) {
      console.error('Erro ao parsear o JSON:', parseErr); // Log do erro
      res.status(500).send('Erro ao processar o JSON');
    }
  });
});

// Rota para atualizar uma pergunta existente
app.put('/api/perguntas/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updatedQuestion = req.body;

  fs.readFile(path.join(__dirname, 'public', 'perguntas.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err); // Log do erro
      res.status(500).send('Erro ao ler o arquivo');
      return;
    }

    try {
      let perguntas = JSON.parse(data);
      perguntas = perguntas.map(p =>
        p.id === id ? { ...p, ...updatedQuestion } : p
      );

      fs.writeFile(path.join(__dirname, 'public', 'perguntas.json'), JSON.stringify(perguntas, null, 2), 'utf8', (err) => {
        if (err) {
          console.error('Erro ao salvar o arquivo:', err); // Log do erro
          res.status(500).send('Erro ao salvar o arquivo');
          return;
        }
        res.status(200).json(updatedQuestion);
      });
    } catch (parseErr) {
      console.error('Erro ao parsear o JSON:', parseErr); // Log do erro
      res.status(500).send('Erro ao processar o JSON');
    }
  });
});

// Inicializar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
