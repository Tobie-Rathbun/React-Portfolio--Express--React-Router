import React, { useState, useEffect } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import '@babylonjs/inspector';
import axios from 'axios';
import { HotKeys } from 'react-hotkeys';
import '../styles.css';

const PokerFrogs = () => {
    // Global scope
    const [sliderValue, setSliderValue] = useState(50);
    const [potSize, setPotSize] = useState(0);
    const [wallet, setWallet] = useState(20000);
    const [blind, setBlind] = useState(200);
    const [betCurrent, setBetCurrent] = useState(blind);
    const [bets, setBets] = useState({ p0: 0, p1: 0, p2: 0, p3: 0, p4: 0 });
    const [hands, setHands] = useState({});
    const [community, setCommunity] = useState([]);
    const [scene, setScene] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [guiPosition, setGuiPosition] = useState({ x: '50%', y: '50%' });
    const [isMinimized, setIsMinimized] = useState(false);
    const [isSceneReady, setIsSceneReady] = useState(false);
    const logMeshDetails = (mesh) => {
        console.log(`Mesh: ${mesh.name}`);
        console.log(`Position: ${mesh.position}`);
        console.log(`Rotation: ${mesh.rotation}`);
        console.log(`Scale: ${mesh.scaling}`);
        console.log(`Material: ${mesh.material}`);
    };
    const logAllMeshes = (scene) => {
        scene.meshes.forEach(mesh => {
            logMeshDetails(mesh);
        });
    };

    const deck = [
        '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '0H', 'JH', 'QH', 'KH', 'AH',
        '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '0D', 'JD', 'QD', 'KD', 'AD',
        '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '0C', 'JC', 'QC', 'KC', 'AC',
        '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '0S', 'JS', 'QS', 'KS', 'AS'
    ];

    const shuffle = (array) => {
        let currentIndex = array.length;
        let randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    };

    const draw = (cards) => cards.shift();
    const drawHand = (cards) => [draw(cards), draw(cards)];

    const initializeGame = () => {
        let shuffledDeck = shuffle([...deck]);
        let newHands = {};
        for (let i = 0; i <= 4; i++) {
            newHands[`p${i}`] = drawHand(shuffledDeck);
        }
        setHands(newHands);
        setCommunity([
            draw(shuffledDeck), draw(shuffledDeck), draw(shuffledDeck),
            draw(shuffledDeck), draw(shuffledDeck)
        ]);
    };

    const handleSliderChange = (event) => {
        setSliderValue(parseInt(event.target.value));
    };

    const increaseBet = () => {
        setSliderValue(prevValue => Math.min(prevValue + 100, 1000));
    };

    const decreaseBet = () => {
        setSliderValue(prevValue => Math.max(prevValue - 100, blind));
    };

    const toggleGui = () => {
        setIsMinimized(prevState => !prevState);
    };

    const createCard = (card, scene) => {
        const cardMaterial = new BABYLON.StandardMaterial("cardMaterial", scene);
        cardMaterial.diffuseTexture = new BABYLON.Texture(`/images/${card}.png`, scene);
    
        cardMaterial.emissiveTexture = cardMaterial.diffuseTexture;
        cardMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);

        const faceUV = [
            new BABYLON.Vector4(0, 0, 1 / 114, 1), 
            new BABYLON.Vector4(1 / 114, 0, 2 / 114, 1), 
            new BABYLON.Vector4(2 / 114, 0, 3 / 114, 1), 
            new BABYLON.Vector4(3 / 114, 0, 4 / 114, 1), 
            new BABYLON.Vector4(4 / 114, 0, 59 / 114, 1), 
            new BABYLON.Vector4(59 / 114, 0, 1, 1)   
        ];

        const cardMesh = BABYLON.MeshBuilder.CreateBox("card", {
            width: 2.5 / 3.5, 
            height: 0.005, 
            depth: 1, 
            faceUV: faceUV
        }, scene);
        cardMesh.material = cardMaterial;
    
        return cardMesh;
    };

    const displayHand = (hand, scene, position, faceDown = false) => {
        if (!hand) return;
        hand.forEach((card, index) => {
            const cardMesh = createCard(card, scene);
            cardMesh.position = new BABYLON.Vector3(position.x + index * 0.4, 0, position.z);
            if (faceDown) {
                cardMesh.rotation.y = Math.PI;
            }
        });
    };

    const onSceneReady = async (scene) => {
        const canvas = scene.getEngine().getRenderingCanvas();
        const camera = new BABYLON.ArcRotateCamera("myCamera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.alpha = -1.04;
        camera.beta = 1.12;
        camera.radius = 1;
        camera.wheelPrecision = 100;
        scene.activeCamera = camera; // Ensure the camera is assigned to the scene's activeCamera
    
        const light = new BABYLON.DirectionalLight("directionalLight", new BABYLON.Vector3(-1, -1, -1), scene);
        light.intensity = 0.5;
    
        const ground = BABYLON.MeshBuilder.CreateGround("myGround", { width: 50, height: 50 }, scene);
        ground.position = new BABYLON.Vector3(0, -2, 0);
        ground.receiveShadows = true;
        ground.material = new BABYLON.StandardMaterial("groundMaterial", scene);
        ground.material.diffuseColor = new BABYLON.Color3(0.6, 0.4, 0.2);

    
        const cowPositions = [
            new BABYLON.Vector3(-3, 0, 4),
            new BABYLON.Vector3(-1, 0, 4),
            new BABYLON.Vector3(1, 0, 4),
            new BABYLON.Vector3(3, 0, 4)
        ];
        
        for (let i = 0; i < 4; i++) {
            try {
                const result = await BABYLON.SceneLoader.ImportMeshAsync(null, '/models/', 'Cow.glb', scene);
                if (result.meshes.length > 0) {
                    const cow = result.meshes[0];
                    cow.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
                    cow.position = cowPositions[i];
                    cow.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
        
                    // Check if the cow has a material and if not, create a default material
                    if (!cow.material) {
                        let cowMaterial = new BABYLON.StandardMaterial("cowMaterial", scene);
                        cowMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1); // Ensure the cow is visible
                        cowMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1); // Ensure the cow is visible
                        cow.material = cowMaterial;
                        console.log(`Cow ${i} assigned a default material.`);
                    } else {
                        console.log(`Cow ${i} using existing material.`);
                    }
        
                    console.log(`Cow ${i} created with material:`, cow.material);
                    console.log(`Cow ${i} position: ${cow.position}, scaling: ${cow.scaling}, rotation: ${cow.rotation}`);
                    console.log(`Cow ${i} successfully added to the scene.`);
                } else {
                    console.error(`No meshes found in the GLB file for cow ${i}.`);
                }
            } catch (error) {
                console.error(`Error loading cow ${i}:`, error);
            }
        }
    
        displayHand(hands.p0, scene, new BABYLON.Vector3(0, 0, -2));
        for (let i = 1; i <= 4; i++) {
            displayHand(hands[`p${i}`], scene, new BABYLON.Vector3(cowPositions[i - 1].x, 0, 3.5), true);
        }
        displayHand(community, scene, new BABYLON.Vector3(-1, 0, 1));
    
        const utilLayer = new BABYLON.UtilityLayerRenderer(scene);
        const positionGizmo = new BABYLON.PositionGizmo(utilLayer);
        const rotationGizmo = new BABYLON.RotationGizmo(utilLayer);
        const scaleGizmo = new BABYLON.ScaleGizmo(utilLayer);
        let activeGizmo = null;
    
        
        console.log("Initial scene setup:");
        scene.meshes.forEach(mesh => {
            logMeshDetails(mesh);
        });

        scene.onPointerDown = function castRay(event) {
            if (event.button === 0) {
                const hit = scene.pick(scene.pointerX, scene.pointerY);
                if (hit.pickedMesh) {
                    positionGizmo.attachedMesh = hit.pickedMesh;
                    rotationGizmo.attachedMesh = null;
                    scaleGizmo.attachedMesh = null;
                    activeGizmo = positionGizmo;
                }
            }
        };
    
        const logMeshInfo = (mesh) => {
            const position = mesh.position;
            const rotation = mesh.rotation;
            const scaling = mesh.scaling;
            console.log(`Position: (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})`);
            console.log(`Rotation: (${rotation.x.toFixed(2)}, ${rotation.y.toFixed(2)}, ${rotation.z.toFixed(2)})`);
            console.log(`Scale: (${scaling.x.toFixed(2)}, ${scaling.y.toFixed(2)}, ${scaling.z.toFixed(2)})`);
        };
    
        const deleteSelectedMesh = () => {
            if (activeGizmo && activeGizmo.attachedMesh) {
                activeGizmo.attachedMesh.dispose();
                activeGizmo.attachedMesh = null;
                console.log('Selected mesh deleted.');
            } else {
                console.log('No mesh is attached to any gizmo.');
            }
        };
    
        window.addEventListener('keydown', (event) => {
            switch (event.key.toLowerCase()) {
                case 'r':
                    if (activeGizmo) {
                        rotationGizmo.attachedMesh = activeGizmo.attachedMesh;
                        positionGizmo.attachedMesh = null;
                        scaleGizmo.attachedMesh = null;
                        activeGizmo = rotationGizmo;
                        console.log('Switched to Rotation Gizmo');
                    }
                    break;
                case 's':
                    if (activeGizmo) {
                        scaleGizmo.attachedMesh = activeGizmo.attachedMesh;
                        positionGizmo.attachedMesh = null;
                        rotationGizmo.attachedMesh = null;
                        activeGizmo = scaleGizmo;
                        console.log('Switched to Scale Gizmo');
                    }
                    break;
                case 'p':
                    if (activeGizmo) {
                        positionGizmo.attachedMesh = activeGizmo.attachedMesh;
                        rotationGizmo.attachedMesh = null;
                        scaleGizmo.attachedMesh = null;
                        activeGizmo = positionGizmo;
                        console.log('Switched to Position Gizmo');
                    }
                    break;
                case 'l':
                    if (activeGizmo && activeGizmo.attachedMesh) {
                        console.clear();
                        logMeshInfo(activeGizmo.attachedMesh);
                    } else {
                        console.log('No mesh is attached to any gizmo.');
                    }
                    break;
                case 'd':
                    positionGizmo.attachedMesh = null;
                    rotationGizmo.attachedMesh = null;
                    scaleGizmo.attachedMesh = null;
                    activeGizmo = null;
                    console.log('Gizmo removed');
                    break;
                case 'delete':
                    deleteSelectedMesh();
                    break;
                default:
                    break;
            }
        });

        console.log("Meshes in the scene:", scene.meshes);
    };

    const loadInitialScene = async (scene, sceneId = 1) => {
        try {
            const response = await axios.get(`http://localhost:4242/api/scene/${sceneId}`);
            if (response.status === 404) {
                throw new Error(`Scene with ID ${sceneId} not found.`);
            }
            const initialSceneConfig = response.data;

            const canvas = scene.getEngine().getRenderingCanvas();
            const camera = new BABYLON.ArcRotateCamera("myCamera", new BABYLON.Vector3(0, 0, 10), scene);
            camera.attachControl(canvas, true);
            camera.alpha = initialSceneConfig.camera.alpha;
            camera.beta = initialSceneConfig.camera.beta;
            camera.radius = initialSceneConfig.camera.radius;
            camera.wheelPrecision = initialSceneConfig.camera.wheelPrecision;
            scene.activeCamera = camera;

            // Remove all existing meshes before loading new ones
            scene.meshes.forEach(mesh => mesh.dispose());
            scene.lights.forEach(light => light.dispose());
            scene.cameras.forEach(cam => cam.dispose());
            scene.textures.forEach(texture => texture.dispose());

            const light = new BABYLON.DirectionalLight("directionalLight", new BABYLON.Vector3(-1, -1, -1), scene);
            light.intensity = 0.5;

            // Load new meshes
            for (const cowConfig of initialSceneConfig.cows) {
                const result = await BABYLON.SceneLoader.ImportMeshAsync(null, '/models/', 'Cow.glb', scene);
                const cow = result.meshes[0];
                cow.name = cowConfig.name;
                cow.position = new BABYLON.Vector3(...cowConfig.position);
                cow.rotation = new BABYLON.Vector3(...cowConfig.rotation);
                cow.scaling = new BABYLON.Vector3(...cowConfig.scale);

                // Ensure the material is correctly applied
                if (cow.material) {
                    cow.material.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
                } else {
                    cow.material = new BABYLON.StandardMaterial("cowMaterial", scene);
                    cow.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
                    cow.material.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
                }
            }

            for (const cardConfig of initialSceneConfig.cards) {
                const cardMesh = createCard(cardConfig.name, scene);
                cardMesh.position = new BABYLON.Vector3(...cardConfig.position);
                cardMesh.rotation = new BABYLON.Vector3(...cardConfig.rotation);
                cardMesh.scaling = new BABYLON.Vector3(...cardConfig.scale);
            }

            const ground = BABYLON.MeshBuilder.CreateGround("myGround", { width: 50, height: 50 }, scene);
            ground.position = new BABYLON.Vector3(0, -2, 0);
            ground.receiveShadows = true;
            ground.material = new BABYLON.StandardMaterial("groundMaterial", scene);
            ground.material.diffuseColor = new BABYLON.Color3(0.6, 0.4, 0.2);

            setIsSceneReady(true);
            console.log(`Scene ${sceneId} loaded successfully.`);
        } catch (error) {
            console.error('Error loading initial scene:', error);
            createDefaultScene(scene);
        }
    };

    const createDefaultScene = (scene) => {
        const canvas = scene.getEngine().getRenderingCanvas();
        const camera = new BABYLON.ArcRotateCamera("defaultCamera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.alpha = -1.04;
        camera.beta = 1.12;
        camera.radius = 10;
        camera.wheelPrecision = 100;
        scene.activeCamera = camera; // Ensure the camera is assigned to the scene's activeCamera
    
        const light = new BABYLON.DirectionalLight("directionalLight", new BABYLON.Vector3(-1, -1, -1), scene);
        light.intensity = 0.5;
    
        const ground = BABYLON.MeshBuilder.CreateGround("defaultGround", { width: 50, height: 50 }, scene);
        ground.position = new BABYLON.Vector3(0, -2, 0);
        ground.receiveShadows = true;
        ground.material = new BABYLON.StandardMaterial("groundMaterial", scene);
        ground.material.diffuseColor = new BABYLON.Color3(0.6, 0.4, 0.2);
    
        setIsSceneReady(true);
    };

    useEffect(() => {
        const canvas = document.getElementById("renderCanvas");
        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);
        setScene(scene);
    
        const runRenderLoop = () => {
            engine.runRenderLoop(() => {
                if (scene && scene.activeCamera) {
                    scene.render();
                }
            });
        };
    
        loadInitialScene(scene).then(() => {
            runRenderLoop();
        });
    
        window.addEventListener("resize", function () {
            if (engine) {
                engine.resize();
            }
        });
    
        initializeGame();
    
        return () => {
            window.removeEventListener("resize", function () {
                if (engine) {
                    engine.resize();
                }
            });
            engine.dispose();
        };
    }, []);
    
    
    useEffect(() => {
        if (scene && Object.keys(hands).length > 0) {
            onSceneReady(scene);
            logAllMeshes(scene);
        }
    }, [scene, hands]);

    const handleMouseDown = (event) => {
        if (!event.target.classList.contains('slider') && !event.target.classList.contains('gui-button')) {
            setIsDragging(true);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (event) => {
        if (isDragging) {
            const x = Math.max(0, Math.min(window.innerWidth - (isMinimized ? 100 : 400), event.clientX));
            const y = Math.max(0, Math.min(window.innerHeight - (isMinimized ? 40 : 200), event.clientY));
            setGuiPosition({ x: `${x}px`, y: `${y}px` });
        }
    };

    const keyMap = {
        save1: 'alt+1',
        save2: 'alt+2',
        save3: 'alt+3',
        save4: 'alt+4',
        save5: 'alt+5',
        load1: '1',
        load2: '2',
        load3: '3',
        load4: '4',
        load5: '5'
    };

    const saveSceneState = async (sceneId) => {
        if (!scene || !scene.getEngine()) {
            console.error("Scene or engine is not available.");
            return;
        }
    
        const camera = scene.activeCamera;
        const cameraConfig = {
            alpha: camera.alpha,
            beta: camera.beta,
            radius: camera.radius,
            wheelPrecision: camera.wheelPrecision
        };
    
        let cowConfigs = scene.meshes.filter(mesh => mesh.name.startsWith("Cow")).map(cow => ({
            name: cow.name,
            position: [cow.position.x, cow.position.y, cow.position.z],
            rotation: [cow.rotation.x, cow.rotation.y, cow.rotation.z],
            scale: [cow.scaling.x, cow.scaling.y, cow.scaling.z]
        }));
    
        if (cowConfigs.length === 0) {
            const defaultCowPositions = [
                new BABYLON.Vector3(-3, 0, 4),
                new BABYLON.Vector3(-1, 0, 4),
                new BABYLON.Vector3(1, 0, 4),
                new BABYLON.Vector3(3, 0, 4)
            ];
    
            cowConfigs = defaultCowPositions.map((pos, index) => ({
                name: `Cow${index + 1}`,
                position: [pos.x, pos.y, pos.z],
                rotation: [0, Math.PI / 2, 0],
                scale: [0.25, 0.25, 0.25]
            }));
        }
    
        const cardConfigs = scene.meshes.filter(mesh => mesh.name.startsWith("card")).map(card => ({
            name: card.material.diffuseTexture.name.split('/').pop().split('.')[0],
            position: [card.position.x, card.position.y, card.position.z],
            rotation: [card.rotation.x, card.rotation.y, card.rotation.z],
            scale: [card.scaling.x, card.scaling.y, card.scaling.z]
        }));
    
        const sceneConfig = {
            camera: cameraConfig,
            cows: cowConfigs,
            cards: cardConfigs
        };
    
        console.log("Saving scene configuration:", sceneConfig);
        
    
        try {
            const formattedSceneConfig = JSON.stringify(sceneConfig, null, 4);
            await axios.post(`http://localhost:4242/api/scene/${sceneId}`, formattedSceneConfig, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(`Scene ${sceneId} saved successfully.`);
            logAllMeshes(scene);
        } catch (error) {
            console.error(`Error saving scene ${sceneId}:`, error);
        }
    };
    

    
    const loadSceneState = async (scene, sceneId) => {
        try {
            const response = await axios.get(`http://localhost:4242/api/scene/${sceneId}`);
            const sceneConfig = response.data;

            console.log("Loading scene configuration:", sceneConfig);
    
            const camera = scene.activeCamera;
            camera.alpha = sceneConfig.camera.alpha;
            camera.beta = sceneConfig.camera.beta;
            camera.radius = sceneConfig.camera.radius;
            camera.wheelPrecision = sceneConfig.camera.wheelPrecision;
    
            // Remove old meshes before loading new ones
            scene.meshes.forEach(mesh => {
                if (mesh.name !== "myGround" && mesh.name !== "defaultGround") {
                    mesh.dispose();
                }
            });
    
            console.log("Old meshes removed");
    
            for (const cowConfig of sceneConfig.cows) {
                const result = await BABYLON.SceneLoader.ImportMeshAsync(null, '/models/', 'Cow.glb', scene);
                const cow = result.meshes[0];
                cow.name = cowConfig.name;
                cow.position = new BABYLON.Vector3(...cowConfig.position);
                cow.rotation = new BABYLON.Vector3(...cowConfig.rotation);
                cow.scaling = new BABYLON.Vector3(...cowConfig.scale);
    
                // Ensure the material is correctly applied
                if (cow.material) {
                    cow.material.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
                } else {
                    cow.material = new BABYLON.StandardMaterial("cowMaterial", scene);
                    cow.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
                    cow.material.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
                }
    
                console.log(`Loaded cow: ${cow.name} at position ${cow.position}`);
            }
    
            for (const cardConfig of sceneConfig.cards) {
                const cardMesh = createCard(cardConfig.name, scene);
                cardMesh.position = new BABYLON.Vector3(...cardConfig.position);
                cardMesh.rotation = new BABYLON.Vector3(...cardConfig.rotation);
                cardMesh.scaling = new BABYLON.Vector3(...cardConfig.scale);
    
                console.log(`Loaded card: ${cardConfig.name} at position ${cardMesh.position}`);
            }
    
            setIsSceneReady(true);
            console.log(`Scene ${sceneId} loaded successfully.`);
            logAllMeshes(scene);
            
        } catch (error) {
            console.error(`Error loading scene ${sceneId}:`, error);
            createDefaultScene(scene);
        }
    };
    
    
    
    
    
    
    
    
    
    
    
    const handlers = {
        save1: () => { if (isSceneReady) saveSceneState(1); },
        save2: () => { if (isSceneReady) saveSceneState(2); },
        save3: () => { if (isSceneReady) saveSceneState(3); },
        save4: () => { if (isSceneReady) saveSceneState(4); },
        save5: () => { if (isSceneReady) saveSceneState(5); },
        load1: () => { loadInitialScene(scene, 1); },
        load2: () => { loadInitialScene(scene, 2); },
        load3: () => { loadInitialScene(scene, 3); },
        load4: () => { loadInitialScene(scene, 4); },
        load5: () => { loadInitialScene(scene, 5); }
    };

    return (
        <HotKeys keyMap={keyMap} handlers={handlers}>
            <div style={{ overflow: 'hidden' }} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
                <canvas id="renderCanvas" style={{ width: '100%', height: '100vh' }}></canvas>
                <div
                    className="gui-container purple-gui"
                    style={{ left: guiPosition.x, top: guiPosition.y, position: 'absolute', height: isMinimized ? '40px' : '200px', width: isMinimized ? '100px' : '400px' }}
                    onMouseDown={handleMouseDown}
                >
                    <div className="button-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button className="gui-button" onClick={toggleGui} style={{ marginLeft: 'auto', marginRight: '5px' }}>{isMinimized ? '+' : '-'}</button>
                    </div>
                    {!isMinimized && (
                        <>
                            <div className="slider-container">
                                <input
                                    type="range"
                                    min={blind}
                                    max="1000"
                                    value={sliderValue}
                                    onChange={handleSliderChange}
                                    className="slider"
                                    id="myRange"
                                />
                                <p>Value: {sliderValue}</p>
                            </div>
                            <div className="button-container">
                                <button className="gui-button" onClick={() => { /* fold logic */ }}>Fold</button>
                                <button className="gui-button" onClick={() => { /* check logic */ }}>Check</button>
                                <button className="gui-button" onClick={() => { /* call logic */ }}>Call</button>
                                <button className="gui-button" onClick={() => { /* raise logic */ }}>Raise</button>
                                <button className="gui-button" onClick={decreaseBet}>-</button>
                                <button className="gui-button" onClick={increaseBet}>+</button>
                            </div>
                        </>
                    )}
                </div>
                <div className="card-display">
                    <p style={{ fontSize: '12px' }}>
                        Player 0 Hand: {hands.p0 && hands.p0.join(', ')}<br />
                        Player 1 Hand: {hands.p1 && hands.p1.join(', ')}<br />
                        Player 2 Hand: {hands.p2 && hands.p2.join(', ')}<br />
                        Player 3 Hand: {hands.p3 && hands.p3.join(', ')}<br />
                        Player 4 Hand: {hands.p4 && hands.p4.join(', ')}<br />
                        Community Cards: {community.join(', ')}<br />
                        Deck: {deck.join(', ')}
                    </p>
                </div>
            </div>
        </HotKeys>
    );
};

export default PokerFrogs;
