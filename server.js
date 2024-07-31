const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 4242;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database('./data.db');

// Create the scenes table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS scenes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT
    )`);
});

// Endpoint to get a scene by ID
app.get('/api/scene/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT data FROM scenes WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (row) {
            res.json(JSON.parse(row.data));
        } else {
            res.status(404).send('Scene not found');
        }
    });
});

// Endpoint to save a scene by ID
app.post('/api/scene/:id', (req, res) => {
    const id = req.params.id;
    const data = JSON.stringify(req.body);

    db.run('INSERT OR REPLACE INTO scenes (id, data) VALUES (?, ?)', [id, data], (err) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send('Scene saved successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
