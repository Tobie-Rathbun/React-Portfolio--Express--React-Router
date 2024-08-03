const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Create a new SQLite database (data.db) or open the existing one
const db = new sqlite3.Database('./data.db');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 4242;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Create a new database table for storing scene configurations if it doesn't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS scenes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            camera TEXT,
            cows TEXT,
            cards TEXT
        )
    `);

    // Check if scenes exist, if not, insert default scenes
    db.get("SELECT COUNT(*) as count FROM scenes", (err, row) => {
        if (err) {
            console.error("Error checking scenes count:", err);
            return;
        }

        if (row.count === 0) {
            const defaultScenes = [
                {
                    camera: JSON.stringify({
                        alpha: -1.04,
                        beta: 1.12,
                        radius: 10,
                        wheelPrecision: 100
                    }),
                    cows: JSON.stringify([
                        { name: "Cow1", position: [-3, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow2", position: [-1, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow3", position: [1, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow4", position: [3, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] }
                    ]),
                    cards: JSON.stringify([
                        { name: "card_0", position: [0, 0, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_1", position: [0.4, 0, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_2", position: [-3, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_3", position: [-2.6, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_4", position: [-1, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_5", position: [-0.6, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_6", position: [1, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_7", position: [1.4, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_8", position: [3, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_9", position: [3.4, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_10", position: [-1, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_11", position: [-0.6, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_12", position: [-0.2, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_13", position: [0.2, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_14", position: [0.6, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] }
                    ])
                },
                {
                    camera: JSON.stringify({
                        alpha: -1.04,
                        beta: 1.12,
                        radius: 11,
                        wheelPrecision: 100
                    }),
                    cows: JSON.stringify([
                        { name: "Cow1", position: [-3, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow2", position: [-1, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow3", position: [1, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow4", position: [3, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] }
                    ]),
                    cards: JSON.stringify([
                        { name: "card_0", position: [0, 0, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_1", position: [0.4, 0, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_2", position: [-3, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_3", position: [-2.6, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_4", position: [-1, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_5", position: [-0.6, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_6", position: [1, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_7", position: [1.4, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_8", position: [3, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_9", position: [3.4, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_10", position: [-1, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_11", position: [-0.6, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_12", position: [-0.2, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_13", position: [0.2, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_14", position: [0.6, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] }
                    ])
                },
                {
                    camera: JSON.stringify({
                        alpha: -1.04,
                        beta: 1.12,
                        radius: 12,
                        wheelPrecision: 100
                    }),
                    cows: JSON.stringify([
                        { name: "Cow1", position: [-3, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow2", position: [-1, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow3", position: [1, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow4", position: [3, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] }
                    ]),
                    cards: JSON.stringify([
                        { name: "card_0", position: [0, 0, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_1", position: [0.4, 0, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_2", position: [-3, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_3", position: [-2.6, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_4", position: [-1, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_5", position: [-0.6, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_6", position: [1, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_7", position: [1.4, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_8", position: [3, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_9", position: [3.4, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_10", position: [-1, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_11", position: [-0.6, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_12", position: [-0.2, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_13", position: [0.2, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_14", position: [0.6, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] }
                    ])
                },
                {
                    camera: JSON.stringify({
                        alpha: -1.04,
                        beta: 1.12,
                        radius: 13,
                        wheelPrecision: 100
                    }),
                    cows: JSON.stringify([
                        { name: "Cow1", position: [-3, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow2", position: [-1, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow3", position: [1, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow4", position: [3, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] }
                    ]),
                    cards: JSON.stringify([
                        { name: "card_0", position: [0, 0, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_1", position: [0.4, 0, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_2", position: [-3, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_3", position: [-2.6, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_4", position: [-1, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_5", position: [-0.6, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_6", position: [1, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_7", position: [1.4, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_8", position: [3, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_9", position: [3.4, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_10", position: [-1, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_11", position: [-0.6, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_12", position: [-0.2, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_13", position: [0.2, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_14", position: [0.6, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] }
                    ])
                },
                {
                    camera: JSON.stringify({
                        alpha: -1.04,
                        beta: 1.12,
                        radius: 14,
                        wheelPrecision: 100
                    }),
                    cows: JSON.stringify([
                        { name: "Cow1", position: [-3, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow2", position: [-1, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow3", position: [1, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow4", position: [3, 0, 4], rotation: [0, Math.PI / 2, 0], scale: [0.25, 0.25, 0.25] }
                    ]),
                    cards: JSON.stringify([
                        { name: "card_0", position: [0, 0, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_1", position: [0.4, 0, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_2", position: [-3, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_3", position: [-2.6, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_4", position: [-1, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_5", position: [-0.6, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_6", position: [1, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_7", position: [1.4, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_8", position: [3, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_9", position: [3.4, 0, 3.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
                        { name: "card_10", position: [-1, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_11", position: [-0.6, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_12", position: [-0.2, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_13", position: [0.2, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
                        { name: "card_14", position: [0.6, 0, 1], rotation: [0, 0, 0], scale: [1, 1, 1] }
                    ])
                }
            ];

            defaultScenes.forEach(scene => {
                db.run(`
                    INSERT INTO scenes (camera, cows, cards)
                    VALUES (?, ?, ?)
                `, [scene.camera, scene.cows, scene.cards]);
            });

            console.log("Inserted default scenes into the database.");
        }
    });
});

// API to get a scene configuration by ID
app.get('/api/scene/:id', (req, res) => {
    const sceneId = req.params.id;
    db.get("SELECT * FROM scenes WHERE id = ?", [sceneId], (err, row) => {
        if (err) {
            res.status(500).send("Error retrieving scene.");
            return;
        }

        if (!row) {
            res.status(404).send("Scene not found.");
            return;
        }

        res.json({
            camera: JSON.parse(row.camera),
            cows: JSON.parse(row.cows),
            cards: JSON.parse(row.cards)
        });
    });
});

// API to save or update a scene configuration by ID
app.post('/api/scene/:id', (req, res) => {
    const sceneId = req.params.id;
    const { camera, cows, cards } = req.body;

    db.run(`
        INSERT INTO scenes (id, camera, cows, cards)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            camera=excluded.camera,
            cows=excluded.cows,
            cards=excluded.cards
    `, [sceneId, JSON.stringify(camera), JSON.stringify(cows), JSON.stringify(cards)], (err) => {
        if (err) {
            res.status(500).send("Error saving scene.");
            return;
        }

        res.send("Scene saved successfully.");
    });
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
