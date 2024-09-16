const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const serverless = require('serverless-http');

const db = new sqlite3.Database('./data.db');
const app = express();

// const allowedOrigins = ['http://localhost:4141', 'https://tobie-rathbun.netlify.app'];

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     optionsSuccessStatus: 204
// };

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';"
    );
    return next();
});

app.use(express.static(path.join(__dirname, '/')));

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS scenes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            camera TEXT,
            cows TEXT,
            cards TEXT
        )
    `);

    db.get("SELECT COUNT(*) as count FROM scenes", (err, row) => {
        if (err) {
            console.error("Error checking scenes count:", err);
            return;
        }

        if (row.count === 0) {
            const defaultScenes = [
                {
                    id: 1,
                    camera: JSON.stringify({
                        alpha: -1.04,
                        beta: 1.12,
                        radius: 10,
                        wheelPrecision: 100
                    }),
                    cows: JSON.stringify([
                        { name: "Cow1", position: [-2.31, 0.00, 1.24], rotation: [0.00, -1.57, 0.00], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow2", position: [-0.10, 0.00, 2.73], rotation: [0.00, -0.15, 0.00], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow3", position: [1.73, 0.00, 2.68], rotation: [0.00, 0.15, 0.00], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow4", position: [2.96, 0.00, 1.32], rotation: [0.00, 1.57, 0.00], scale: [0.25, 0.25, 0.25] }
                    ]),
                    cards: JSON.stringify([
                        { name: "3C", position: [-0.189, 0, -0.034], rotation: [0.04, -1.5201, 3.1416], scale: [1.0000001854183471, 0.999999782712439, 1.0000001183916423] },
                        { name: "QD", position: [0.106, 0, -0.050], rotation: [0.0236, -1.3562, 3.1416], scale: [1.000000173071773, 1.000000134919915, 1.0000003204145689] },
                        { name: "4C", position: [-1.618, 0, 1.156], rotation: [0, -2.7738, 0], scale: [0.9999999595323771, 1, 0.9999999595323771] },
                        { name: "QH", position: [-1.550, 0, 1.549], rotation: [0, 3.1416, 0], scale: [1, 1, 1] },
                        { name: "0H", position: [-0.187, 0, 2.091], rotation: [0, -1.3146, 0], scale: [1.000000012665419, 1, 1.000000012665419] },
                        { name: "6H", position: [0.142, 0, 2.104], rotation: [0, -1.9379, 0], scale: [1.000000150683327, 1, 1.000000150683327] },
                        { name: "2S", position: [1.424, 0, 2.151], rotation: [0, 1.5530, 0], scale: [1.0000001742299018, 1, 1.0000001742299018] },
                        { name: "6S", position: [1.723, 0, 2.085], rotation: [0, -1.8070, 0], scale: [0.9999998488164599, 1, 0.9999998488164599] },
                        { name: "JC", position: [2.372, 0, 1.496], rotation: [0, 3.1416, 0], scale: [1, 1, 1] },
                        { name: "5S", position: [2.350, 0, 1.161], rotation: [0, 3.1416, 0], scale: [1, 1, 1] },
                        { name: "8H", position: [-0.583, 0.046, 0.939], rotation: [0, 1.5887, 0], scale: [1.000000268770012, 1, 1.000000268770012] },
                        { name: "7H", position: [-0.222, 0, 1.009], rotation: [0, -1.5758, 0], scale: [0.9999999701966147, 1, 0.9999999701966147] },
                        { name: "0D", position: [0.106, 0, 1.003], rotation: [0, -1.5960, 0], scale: [1.0000000298343323, 1, 1.0000000298343323] },
                        { name: "3S", position: [0.477, 0, 1.000], rotation: [0, -1.5841, 0], scale: [1.0000000347703584, 1, 1.0000000347703584] },
                        { name: "3D", position: [0.837, 0, 1.000], rotation: [0, -1.5705, 0], scale: [1.0000001706241837, 1, 1.0000001706241837] }
                    ])
                },
                {
                    id: 2,
                    camera: JSON.stringify({
                        alpha: 1.04,
                        beta: -1.12,
                        radius: 11,
                        wheelPrecision: 100
                    }),
                    cows: JSON.stringify([
                        { name: "Cow1", position: [-3, 0, 4], rotation: [0, 1.5708, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow2", position: [-1, 0, 4], rotation: [0, 1.5708, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow3", position: [1, 0, 4], rotation: [0, 1.5708, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow4", position: [3, 0, 4], rotation: [0, 1.5708, 0], scale: [0.25, 0.25, 0.25] }
                    ]),
                    cards: JSON.stringify([
                        { name: "3C", position: [-0.189, 0, -0.034], rotation: [0.04, -1.5201, 3.1416], scale: [1.0000001854183471, 0.999999782712439, 1.0000001183916423] },
                        { name: "QD", position: [0.106, 0, -0.050], rotation: [0.0236, -1.3562, 3.1416], scale: [1.000000173071773, 1.000000134919915, 1.0000003204145689] },
                        { name: "4C", position: [-1.618, 0, 1.156], rotation: [0, -2.7738, 0], scale: [0.9999999595323771, 1, 0.9999999595323771] },
                        { name: "QH", position: [-1.550, 0, 1.549], rotation: [0, 3.1416, 0], scale: [1, 1, 1] },
                        { name: "0H", position: [-0.187, 0, 2.091], rotation: [0, -1.3146, 0], scale: [1.000000012665419, 1, 1.000000012665419] },
                        { name: "6H", position: [0.142, 0, 2.104], rotation: [0, -1.9379, 0], scale: [1.000000150683327, 1, 1.000000150683327] },
                        { name: "2S", position: [1.424, 0, 2.151], rotation: [0, 1.5530, 0], scale: [1.0000001742299018, 1, 1.0000001742299018] },
                        { name: "6S", position: [1.723, 0, 2.085], rotation: [0, -1.8070, 0], scale: [0.9999998488164599, 1, 0.9999998488164599] },
                        { name: "JC", position: [2.372, 0, 1.496], rotation: [0, 3.1416, 0], scale: [1, 1, 1] },
                        { name: "5S", position: [2.350, 0, 1.161], rotation: [0, 3.1416, 0], scale: [1, 1, 1] },
                        { name: "8H", position: [-0.583, 0.046, 0.939], rotation: [0, 1.5887, 0], scale: [1.000000268770012, 1, 1.000000268770012] },
                        { name: "7H", position: [-0.222, 0, 1.009], rotation: [0, -1.5758, 0], scale: [0.9999999701966147, 1, 0.9999999701966147] },
                        { name: "0D", position: [0.106, 0, 1.003], rotation: [0, -1.5960, 0], scale: [1.0000000298343323, 1, 1.0000000298343323] },
                        { name: "3S", position: [0.477, 0, 1.000], rotation: [0, -1.5841, 0], scale: [1.0000000347703584, 1, 1.0000000347703584] },
                        { name: "3D", position: [0.837, 0, 1.000], rotation: [0, -1.5705, 0], scale: [1.0000001706241837, 1, 1.0000001706241837] }
                    ])
                },
                {
                    id: 3,
                    camera: JSON.stringify({
                        alpha: 1.04,
                        beta: 1.12,
                        radius: 12,
                        wheelPrecision: 100
                    }),
                    cows: JSON.stringify([
                        { name: "Cow1", position: [-3, 0, 4], rotation: [0, 1.5708, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow2", position: [-1, 0, 4], rotation: [0, 1.5708, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow3", position: [1, 0, 4], rotation: [0, 1.5708, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow4", position: [3, 0, 4], rotation: [0, 1.5708, 0], scale: [0.25, 0.25, 0.25] }
                    ]),
                    cards: JSON.stringify([
                        { name: "3C", position: [-0.189, 0, -0.034], rotation: [0.04, -1.5201, 3.1416], scale: [1.0000001854183471, 0.999999782712439, 1.0000001183916423] },
                        { name: "QD", position: [0.106, 0, -0.050], rotation: [0.0236, -1.3562, 3.1416], scale: [1.000000173071773, 1.000000134919915, 1.0000003204145689] },
                        { name: "4C", position: [-1.618, 0, 1.156], rotation: [0, -2.7738, 0], scale: [0.9999999595323771, 1, 0.9999999595323771] },
                        { name: "QH", position: [-1.550, 0, 1.549], rotation: [0, 3.1416, 0], scale: [1, 1, 1] },
                        { name: "0H", position: [-0.187, 0, 2.091], rotation: [0, -1.3146, 0], scale: [1.000000012665419, 1, 1.000000012665419] },
                        { name: "6H", position: [0.142, 0, 2.104], rotation: [0, -1.9379, 0], scale: [1.000000150683327, 1, 1.000000150683327] },
                        { name: "2S", position: [1.424, 0, 2.151], rotation: [0, 1.5530, 0], scale: [1.0000001742299018, 1, 1.0000001742299018] },
                        { name: "6S", position: [1.723, 0, 2.085], rotation: [0, -1.8070, 0], scale: [0.9999998488164599, 1, 0.9999998488164599] },
                        { name: "JC", position: [2.372, 0, 1.496], rotation: [0, 3.1416, 0], scale: [1, 1, 1] },
                        { name: "5S", position: [2.350, 0, 1.161], rotation: [0, 3.1416, 0], scale: [1, 1, 1] },
                        { name: "8H", position: [-0.583, 0.046, 0.939], rotation: [0, 1.5887, 0], scale: [1.000000268770012, 1, 1.000000268770012] },
                        { name: "7H", position: [-0.222, 0, 1.009], rotation: [0, -1.5758, 0], scale: [0.9999999701966147, 1, 0.9999999701966147] },
                        { name: "0D", position: [0.106, 0, 1.003], rotation: [0, -1.5960, 0], scale: [1.0000000298343323, 1, 1.0000000298343323] },
                        { name: "3S", position: [0.477, 0, 1.000], rotation: [0, -1.5841, 0], scale: [1.0000000347703584, 1, 1.0000000347703584] },
                        { name: "3D", position: [0.837, 0, 1.000], rotation: [0, -1.5705, 0], scale: [1.0000001706241837, 1, 1.0000001706241837] }
                    ])
                },
                {
                    id: 4,
                    camera: JSON.stringify({
                        alpha: -1.04,
                        beta: -1.12,
                        radius: 13,
                        wheelPrecision: 100
                    }),
                    cows: JSON.stringify([
                        { name: "Cow1", position: [-3, 0, 4], rotation: [0, 1.5708, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow2", position: [-1, 0, 4], rotation: [0, 1.5708, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow3", position: [1, 0, 4], rotation: [0, 1.5708, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow4", position: [3, 0, 4], rotation: [0, 1.5708, 0], scale: [0.25, 0.25, 0.25] }
                    ]),
                    cards: JSON.stringify([
                        { name: "3C", position: [-0.189, 0, -0.034], rotation: [0.04, -1.5201, 3.1416], scale: [1.0000001854183471, 0.999999782712439, 1.0000001183916423] },
                        { name: "QD", position: [0.106, 0, -0.050], rotation: [0.0236, -1.3562, 3.1416], scale: [1.000000173071773, 1.000000134919915, 1.0000003204145689] },
                        { name: "4C", position: [-1.618, 0, 1.156], rotation: [0, -2.7738, 0], scale: [0.9999999595323771, 1, 0.9999999595323771] },
                        { name: "QH", position: [-1.550, 0, 1.549], rotation: [0, 3.1416, 0], scale: [1, 1, 1] },
                        { name: "0H", position: [-0.187, 0, 2.091], rotation: [0, -1.3146, 0], scale: [1.000000012665419, 1, 1.000000012665419] },
                        { name: "6H", position: [0.142, 0, 2.104], rotation: [0, -1.9379, 0], scale: [1.000000150683327, 1, 1.000000150683327] },
                        { name: "2S", position: [1.424, 0, 2.151], rotation: [0, 1.5530, 0], scale: [1.0000001742299018, 1, 1.0000001742299018] },
                        { name: "6S", position: [1.723, 0, 2.085], rotation: [0, -1.8070, 0], scale: [0.9999998488164599, 1, 0.9999998488164599] },
                        { name: "JC", position: [2.372, 0, 1.496], rotation: [0, 3.1416, 0], scale: [1, 1, 1] },
                        { name: "5S", position: [2.350, 0, 1.161], rotation: [0, 3.1416, 0], scale: [1, 1, 1] },
                        { name: "8H", position: [-0.583, 0.046, 0.939], rotation: [0, 1.5887, 0], scale: [1.000000268770012, 1, 1.000000268770012] },
                        { name: "7H", position: [-0.222, 0, 1.009], rotation: [0, -1.5758, 0], scale: [0.9999999701966147, 1, 0.9999999701966147] },
                        { name: "0D", position: [0.106, 0, 1.003], rotation: [0, -1.5960, 0], scale: [1.0000000298343323, 1, 1.0000000298343323] },
                        { name: "3S", position: [0.477, 0, 1.000], rotation: [0, -1.5841, 0], scale: [1.0000000347703584, 1, 1.0000000347703584] },
                        { name: "3D", position: [0.837, 0, 1.000], rotation: [0, -1.5705, 0], scale: [1.0000001706241837, 1, 1.0000001706241837] }
                    ])
                },
                {
                    id: 5,
                    camera: JSON.stringify({
                        alpha: -1.04,
                        beta: 1.12,
                        radius: 14,
                        wheelPrecision: 100
                    }),
                    cows: JSON.stringify([
                        { name: "Cow1", position: [-3, 0, 4], rotation: [0, 1.5708, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow2", position: [-1, 0, 4], rotation: [0, 1.5708, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow3", position: [1, 0, 4], rotation: [0, 1.5708, 0], scale: [0.25, 0.25, 0.25] },
                        { name: "Cow4", position: [3, 0, 4], rotation: [0, 1.5708, 0], scale: [0.25, 0.25, 0.25] }
                    ]),
                    cards: JSON.stringify([
                        { name: "3C", position: [-0.189, 0, -0.034], rotation: [0.04, -1.5201, 3.1416], scale: [1.0000001854183471, 0.999999782712439, 1.0000001183916423] },
                        { name: "QD", position: [0.106, 0, -0.050], rotation: [0.0236, -1.3562, 3.1416], scale: [1.000000173071773, 1.000000134919915, 1.0000003204145689] },
                        { name: "4C", position: [-1.618, 0, 1.156], rotation: [0, -2.7738, 0], scale: [0.9999999595323771, 1, 0.9999999595323771] },
                        { name: "QH", position: [-1.550, 0, 1.549], rotation: [0, 3.1416, 0], scale: [1, 1, 1] },
                        { name: "0H", position: [-0.187, 0, 2.091], rotation: [0, -1.3146, 0], scale: [1.000000012665419, 1, 1.000000012665419] },
                        { name: "6H", position: [0.142, 0, 2.104], rotation: [0, -1.9379, 0], scale: [1.000000150683327, 1, 1.000000150683327] },
                        { name: "2S", position: [1.424, 0, 2.151], rotation: [0, 1.5530, 0], scale: [1.0000001742299018, 1, 1.0000001742299018] },
                        { name: "6S", position: [1.723, 0, 2.085], rotation: [0, -1.8070, 0], scale: [0.9999998488164599, 1, 0.9999998488164599] },
                        { name: "JC", position: [2.372, 0, 1.496], rotation: [0, 3.1416, 0], scale: [1, 1, 1] },
                        { name: "5S", position: [2.350, 0, 1.161], rotation: [0, 3.1416, 0], scale: [1, 1, 1] },
                        { name: "8H", position: [-0.583, 0.046, 0.939], rotation: [0, 1.5887, 0], scale: [1.000000268770012, 1, 1.000000268770012] },
                        { name: "7H", position: [-0.222, 0, 1.009], rotation: [0, -1.5758, 0], scale: [0.9999999701966147, 1, 0.9999999701966147] },
                        { name: "0D", position: [0.106, 0, 1.003], rotation: [0, -1.5960, 0], scale: [1.0000000298343323, 1, 1.0000000298343323] },
                        { name: "3S", position: [0.477, 0, 1.000], rotation: [0, -1.5841, 0], scale: [1.0000000347703584, 1, 1.0000000347703584] },
                        { name: "3D", position: [0.837, 0, 1.000], rotation: [0, -1.5705, 0], scale: [1.0000001706241837, 1, 1.0000001706241837] }
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



// // New Route to Fetch Card Data
// app.get('/api/cards', (req, res) => {
//     db.all("SELECT * FROM cards", [], (err, rows) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         res.json({
//             message: "success",
//             data: rows
//         });
//     });
// });

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



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});


// const PORT = process.env.PORT || 4141;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

module.exports = app;
module.exports.handler = serverless(app);