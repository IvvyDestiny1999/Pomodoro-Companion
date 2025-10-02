const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('frontend'));

// Mock DB
const dbPath = './db/data.json';
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({ users: [], logs: [] }, null, 2));

// CRUD API
app.get('/api/users', (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath));
    res.json(db.users);
});

app.post('/api/users', (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath));
    const newUser = { id: Date.now(), ...req.body };
    db.users.push(newUser);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.json(newUser);
});

app.put('/api/users/:id', (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath));
    const id = parseInt(req.params.id);
    const idx = db.users.findIndex(u => u.id === id);
    if (idx === -1) return res.status(404).send("User not found");
    db.users[idx] = { ...db.users[idx], ...req.body };
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.json(db.users[idx]);
});

app.delete('/api/users/:id', (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath));
    const id = parseInt(req.params.id);
    db.users = db.users.filter(u => u.id !== id);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.json({ success: true });
});

// Pomodoro logs
app.post('/api/logs', (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath));
    const log = { id: Date.now(), ...req.body };
    db.logs.push(log);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.json(log);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));