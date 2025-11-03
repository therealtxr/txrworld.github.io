const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Banco de dados
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) console.error(err);
  else console.log('Banco de dados conectado');
});

// Cria tabelas
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE
)`);

db.run(`CREATE TABLE IF NOT EXISTS downloads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT,
  file TEXT,
  date TEXT
)`);

// Rota de login simples
app.post('/login', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email obrigatório' });

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({ error: 'Erro no banco' });

    if (!row) {
      db.run('INSERT INTO users(email) VALUES(?)', [email], (err2) => {
        if (err2) return res.status(500).json({ error: 'Erro ao registrar' });
        res.json({ success: true, newUser: true });
      });
    } else {
      res.json({ success: true, newUser: false });
    }
  });
});

// Rota de registro de download
app.post('/download', (req, res) => {
  const { email, file } = req.body;
  if (!email || !file) return res.status(400).json({ error: 'Dados inválidos' });

  const date = new Date().toISOString();
  db.run('INSERT INTO downloads(email, file, date) VALUES(?, ?, ?)', [email, file, date], (err) => {
    if (err) return res.status(500).json({ error: 'Erro ao registrar download' });
    res.json({ success: true });
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
