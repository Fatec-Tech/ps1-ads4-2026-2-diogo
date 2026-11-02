const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares: rodam antes de todas as rotas
app.use(cors());          // libera o acesso do frontend (outra origem)
app.use(express.json());  // converte o body JSON em objeto, disponível em req.body

// "Banco de dados" em memória (será substituído na Aula 5)
const pacientes = [
  { id: 1, nome: 'Maria Silva M.', email: 'maria.silva@email.com', nascimento: '1990-04-12' },
  { id: 2, nome: 'João Pereira', email: 'joao.pereira@email.com', nascimento: '1985-11-30' },
  { id: 3, nome: 'Ana Costa', email: 'ana.costa@email.com', nascimento: '2001-07-08' },
];
let proximoId = 4;

// READ (lista) — GET /pacientes
app.get('/pacientes', (req, res) => {
  res.json(pacientes);
});

// READ (um) — GET /pacientes/:id
app.get('/pacientes/:id', (req, res) => {
  const id = Number(req.params.id);
  const paciente = pacientes.find((p) => p.id === id);

  if (!paciente) {
    return res.status(404).json({ erro: 'Paciente não encontrado' });
  }

  res.json(paciente);
});

const PORTA = 3000;

app.listen(PORTA, () => {
	console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
