import React, { useState, useEffect } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import '@babylonjs/inspector';
import '../styles.css'; // Corrected import for styles

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
    const [isDragging, setIsDragging] = useState(false);
    const [guiPosition, setGuiPosition] = useState({ x: '50%', y: '50%' });
    const [isMinimized, setIsMinimized] = useState(false);
    const [uvOffset, setUvOffset] = useState(0);

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
    
        // Reintroduce emissive properties for better visibility
        cardMaterial.emissiveTexture = cardMaterial.diffuseTexture;
        cardMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1); // Bright white emissive color
    
        const faceUV = [
            new BABYLON.Vector4(0, 0, 1/114, 1),  // Front face (last 61/114 of the texture)
            new BABYLON.Vector4(1/114, 0, 2/114, 1),  // Back face (next 61/114 of the texture)
            new BABYLON.Vector4(2/114, 0, 3/114, 1),  // Right face (first 1/114 of the texture)
            new BABYLON.Vector4(3/114, 0, 4/114, 1),  // Left face (first 1/114 of the texture)
            new BABYLON.Vector4(4/114, 0, 59/114, 1),  // Back of card (first 1/114 of the texture)
            new BABYLON.Vector4(59/114, 0, 1, 1)   // Face of cards (first 1/114 of the texture)
        ];
    
        const cardMesh = BABYLON.MeshBuilder.CreateBox("card", {
            width: 2.5 / 3.5,  // Adjusting width to height ratio to match the actual card dimensions
            height: 0.005,  // Thickness of the card
            depth: 1,  // This keeps the actual 3.5 height
            faceUV: faceUV
        }, scene);
        cardMesh.material = cardMaterial;
        
        // Rotate the card 90 degrees around the Y-axis
        // cardMesh.rotation.z = Math.PI / 2;
    
        return cardMesh;
    };
    

    const displayHand = (hand, scene, position, faceDown = false) => {
        if (!hand) return;
        hand.forEach((card, index) => {
            const cardMesh = createCard(card, scene);
            cardMesh.position = new BABYLON.Vector3(position.x + index * 0.4, 0, position.z);
            if (faceDown) {
                cardMesh.rotation.y = Math.PI; // Face the card down
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

        const light = new BABYLON.DirectionalLight("directionalLight", new BABYLON.Vector3(-1, 0, 0), scene);
        light.intensity = 0.5;

        const ground = BABYLON.MeshBuilder.CreateGround("myGround", { width: 50, height: 50 }, scene);
        ground.position = new BABYLON.Vector3(0, -2, 0);
        ground.receiveShadows = true;
        ground.material = new BABYLON.StandardMaterial("groundMaterial", scene);
        ground.material.diffuseColor = new BABYLON.Color3(0.6, 0.4, 0.2); // Light brown color for the ground

        const cowPositions = [
            new BABYLON.Vector3(-3, 0, 4),
            new BABYLON.Vector3(-1, 0, 4),
            new BABYLON.Vector3(1, 0, 4),
            new BABYLON.Vector3(3, 0, 4)
        ];

        for (let i = 0; i < 4; i++) {
            const result = await BABYLON.SceneLoader.ImportMeshAsync(null, '/models/', 'Cow.glb', scene);
            const cow = result.meshes[0];
            cow.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
            cow.position = cowPositions[i];
            cow.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0); // Rotate cow 90 degrees clockwise
        }

        displayHand(hands.p0, scene, new BABYLON.Vector3(0, 0, -2));
        for (let i = 1; i <= 4; i++) {
            displayHand(hands[`p${i}`], scene, new BABYLON.Vector3(cowPositions[i - 1].x, 0, 3.5), true);
        }
        displayHand(community, scene, new BABYLON.Vector3(-1, 0, 1));

        // Gizmo setup
        const utilLayer = new BABYLON.UtilityLayerRenderer(scene);
        const positionGizmo = new BABYLON.PositionGizmo(utilLayer);
        const rotationGizmo = new BABYLON.RotationGizmo(utilLayer);
        const scaleGizmo = new BABYLON.ScaleGizmo(utilLayer);
        let activeGizmo = null;

        scene.onPointerDown = function castRay(event) {
            if (event.button === 0) { // Left click only
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

        const logUVInfo = () => {
            console.log(`UV Offset: ${uvOffset}`);
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
                case '1':
                    setUvOffset(prevOffset => Math.max(prevOffset - 1, 0));
                    break;
                case '2':
                    setUvOffset(prevOffset => Math.min(prevOffset + 1, 113));
                    break;
                case 'u':
                    logUVInfo();
                    break;
                default:
                    break;
            }
        });
    };

    useEffect(() => {
        const canvas = document.getElementById("renderCanvas");
        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);
        setScene(scene);

        const runRenderLoop = () => {
            engine.runRenderLoop(() => {
                scene.render();
            });
        };

        if (scene) {
            onSceneReady(scene).then(runRenderLoop);
        }

        window.addEventListener("resize", function () {
            engine.resize();
        });

        initializeGame();
    }, []);

    useEffect(() => {
        if (scene && Object.keys(hands).length > 0) {
            onSceneReady(scene);
        }
    }, [scene, hands, uvOffset]);

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

    return (
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
    );
};

export default PokerFrogs;
