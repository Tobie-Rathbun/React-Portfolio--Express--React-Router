import React, { useState, useEffect } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import '@babylonjs/inspector';
import axios from 'axios';
import { HotKeys } from 'react-hotkeys';
import PokerGUI from './PokerGUI';
import DebugPanel from './DebugPanel';
import '../styles.css';

const PokerFrogs = () => {
    const [sliderValue, setSliderValue] = useState(50);
    const [potSize, setPotSize] = useState(0);
    const [wallet, setWallet] = useState(20000);
    const [blind, setBlind] = useState(200);
    const [betCurrent, setBetCurrent] = useState(blind);
    const [bets, setBets] = useState({ p0: 0, p1: 0, p2: 0, p3: 0, p4: 0 });
    const [hands, setHands] = useState({});
    const [community, setCommunity] = useState([]);
    const [scene, setScene] = useState(null);
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
        const newCommunity = [
            draw(shuffledDeck), draw(shuffledDeck), draw(shuffledDeck),
            draw(shuffledDeck), draw(shuffledDeck)
        ];
        setCommunity(newCommunity);
        console.log("Hands initialized:", newHands);
        console.log("Community cards initialized:", community);
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

    const getCurrentCardNames = () => {
        let cardNames = [];
        for (let i = 0; i <= 4; i++) {
            if (hands[`p${i}`]) {
                cardNames.push(...hands[`p${i}`]);
            }
        }
        cardNames.push(...community);
        console.log("Current card names:", cardNames);
        return cardNames;
    };
    

    const getCardImage = (card) => {
        console.log('card name to pass: ', card);
        return `/images/${card}.png`;
    };    

    const createCard = (card, scene, position, rotation, scale) => {
        const cardMaterial = new BABYLON.StandardMaterial("cardMaterial", scene);
        cardMaterial.diffuseTexture = new BABYLON.Texture(getCardImage(card), scene);
        
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
        
        const cardMesh = BABYLON.MeshBuilder.CreateBox(card, {
            width: 2.5 / 3.5,
            height: 0.005,
            depth: 1,
            faceUV: faceUV
        }, scene);
        cardMesh.material = cardMaterial;
        cardMesh.position = new BABYLON.Vector3(...position);
        cardMesh.rotation = new BABYLON.Vector3(...rotation);
        cardMesh.scaling = new BABYLON.Vector3(...scale);
        
        return cardMesh;
    };    
    

    const createCow = async (name, position, rotation, scale, scene) => {
        const result = await BABYLON.SceneLoader.ImportMeshAsync(null, '/models/', 'Cow.glb', scene);
        const cow = result.meshes[0];
        cow.name = name;
        cow.position = new BABYLON.Vector3(...position);
        cow.rotation = new BABYLON.Vector3(...rotation);
        cow.scaling = new BABYLON.Vector3(...scale);

        // Ensure the material is correctly applied
        cow.material = new BABYLON.StandardMaterial("cowMaterial", scene);
        cow.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        cow.material.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);

        // Play animation if available
        if (cow.animationGroups && cow.animationGroups.length > 0) {
            cow.animationGroups[0].start(true, 1.0, cow.animationGroups[0].from, cow.animationGroups[0].to, false);
        }

        console.log(`Created cow: ${cow.name} at position ${cow.position}`);
        return cow;
    };

    const displayHand = (hand, scene, cardConfig, faceDown = false) => {
        if (!hand) return;
        hand.forEach((card, index) => {
            const position = cardConfig && cardConfig.position ? new BABYLON.Vector3(...cardConfig.position[index]) : new BABYLON.Vector3(0, 0, 0);
            const cardMesh = createCard(card, scene, [position.x + index * 0.4, position.y, position.z], [0, 0, 0], [1, 1, 1]);
            if (faceDown) {
                cardMesh.rotation.y = Math.PI;
            }
        });
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

        loadSceneState(scene, 1).then(() => {
            engine.runRenderLoop(() => {
                if (scene && scene.activeCamera) {
                    scene.render();
                }
            });
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
            logAllMeshes(scene);
        }
    }, [scene, hands]);

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
        console.log("Cow configurations being saved:", cowConfigs);

        const cardConfigs = scene.meshes.filter(mesh => mesh.name.startsWith("card")).map((card, index) => ({
            name: `card_${index}`,
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
    
            // Create camera if it doesn't exist
            if (!scene.activeCamera) {
                const canvas = scene.getEngine().getRenderingCanvas();
                const camera = new BABYLON.ArcRotateCamera("myCamera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
                camera.attachControl(canvas, true);
                camera.alpha = -1.04;
                camera.beta = 1.12;
                camera.radius = 1;
                camera.wheelPrecision = 100;
                scene.activeCamera = camera; // Ensure the camera is assigned to the scene's activeCamera
            }

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
                await createCow(cowConfig.name, cowConfig.position, cowConfig.rotation, cowConfig.scale, scene);
            }
    
            // Get current card names for the round
            const currentCardNames = getCurrentCardNames();
            console.log("Current card names:", currentCardNames);
            
            let cardIndex = 0;
            for (const cardConfig of sceneConfig.cards) {
                const cardName = currentCardNames[cardIndex] || 'default';
                console.log("Card name to pass:", cardName, cardIndex);
                const cardMesh = createCard(cardName, scene, cardConfig.position, cardConfig.rotation, cardConfig.scale);
                cardIndex++;
            }
    
            // Set up lighting and ground
            const light = new BABYLON.DirectionalLight("directionalLight", new BABYLON.Vector3(-1, -1, -1), scene);
            light.intensity = 0.5;
    
            const ground = BABYLON.MeshBuilder.CreateGround("myGround", { width: 50, height: 50 }, scene);
            ground.position = new BABYLON.Vector3(0, -2, 0);
            ground.receiveShadows = true;
            ground.material = new BABYLON.StandardMaterial("groundMaterial", scene);
            ground.material.diffuseColor = new BABYLON.Color3(0.6, 0.4, 0.2);
    
            // Set up gizmos and event listeners
            const utilLayer = new BABYLON.UtilityLayerRenderer(scene);
            const positionGizmo = new BABYLON.PositionGizmo(utilLayer);
            const rotationGizmo = new BABYLON.RotationGizmo(utilLayer);
            const scaleGizmo = new BABYLON.ScaleGizmo(utilLayer);
            let activeGizmo = null;
    
            scene.onPointerDown = function castRay(event) {
                if (event.button === 0) {
                    const hit = scene.pick(scene.pointerX, scene.pointerY);
                    if (hit.pickedMesh) {
                        positionGizmo.attachedMesh = hit.pickedMesh;
                        rotationGizmo.attachedMesh = null;
                        scaleGizmo.attachedMesh = null;
                        activeGizmo = positionGizmo;
                    } else {
                        positionGizmo.attachedMesh = null;
                        rotationGizmo.attachedMesh = null;
                        scaleGizmo.attachedMesh = null;
                        activeGizmo = null;
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
        load1: () => { resetBabylonInstanceAndLoadScene(1); },
        load2: () => { resetBabylonInstanceAndLoadScene(2); },
        load3: () => { resetBabylonInstanceAndLoadScene(3); },
        load4: () => { resetBabylonInstanceAndLoadScene(4); },
        load5: () => { resetBabylonInstanceAndLoadScene(5); }
    };

    const resetBabylonInstanceAndLoadScene = (sceneId) => {
        if (scene) {
            scene.dispose();
        }
    
        const canvas = document.getElementById("renderCanvas");
        const engine = new BABYLON.Engine(canvas, true);
        const newScene = new BABYLON.Scene(engine);
        setScene(newScene);
    
        loadSceneState(newScene, sceneId).then(() => {
            engine.runRenderLoop(() => {
                if (newScene && newScene.activeCamera) {
                    newScene.render();
                }
            });
        });
    };
    

    return (
        <HotKeys keyMap={keyMap} handlers={handlers}>
            <div>
                <canvas id="renderCanvas" style={{ width: '100%', height: '100vh' }}></canvas>
                <PokerGUI
                    sliderValue={sliderValue}
                    handleSliderChange={handleSliderChange}
                    increaseBet={increaseBet}
                    decreaseBet={decreaseBet}
                />
                <DebugPanel hands={hands} community={community} deck={deck} />
            </div>
        </HotKeys>
    );
};

export default PokerFrogs;
