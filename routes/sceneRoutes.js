const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load scene state
router.get('/api/scene/:id', (req, res) => {
    const sceneId = req.params.id;
    const scenePath = path.join(__dirname, `../scenes/scene${sceneId}.json`);

    if (fs.existsSync(scenePath)) {
        const sceneState = fs.readFileSync(scenePath, 'utf8');
        res.send(JSON.parse(sceneState));
    } else {
        res.status(404).send({ error: 'Scene not found' });
    }
});

// Save scene state
router.post('/api/saveSceneState/:id', (req, res) => {
    const sceneId = req.params.id;
    const sceneState = req.body.sceneState;
    const scenePath = path.join(__dirname, `../scenes/scene${sceneId}.json`);

    fs.writeFileSync(scenePath, JSON.stringify(sceneState, null, 2));
    res.send({ message: 'Scene state saved successfully' });
});

module.exports = router;
