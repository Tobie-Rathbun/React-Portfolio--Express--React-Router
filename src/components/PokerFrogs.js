import React, { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import { Inspector } from '@babylonjs/inspector';

const PokerFrogs = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Add no-scroll class to body
        document.body.classList.add('no-scroll');

        const engine = new BABYLON.Engine(canvas, true);
        const FPS = 30;

        const createScene = async () => {
            const scene = new BABYLON.Scene(engine);

            // CAMERA
            const camera = new BABYLON.ArcRotateCamera(
                'myCamera',
                0,
                0,
                10,
                BABYLON.Vector3.Zero(),
                scene
            );
            camera.attachControl(canvas, true);
            camera.alpha = -1.04; 
            camera.beta = 1.12; 
            camera.radius = 1;     
            camera.wheelPrecision = 100;

            // LIGHTING
            const light = new BABYLON.DirectionalLight(
                'directionalLight',
                new BABYLON.Vector3(-1, 0, 0),
                scene
            );
            light.intensity = 0.5;

            // GIZMO & UTILITY
            const utilLayer = new BABYLON.UtilityLayerRenderer(scene);
            const positionGizmo = new BABYLON.PositionGizmo(utilLayer);
            const rotationGizmo = new BABYLON.RotationGizmo(utilLayer);
            const scaleGizmo = new BABYLON.ScaleGizmo(utilLayer);
            const lightGizmo = new BABYLON.LightGizmo(utilLayer);
            lightGizmo.light = light;

            // GROUND
            const ground = BABYLON.MeshBuilder.CreateGround(
                'myGround',
                { width: 50, height: 50 },
                scene
            );
            ground.position = new BABYLON.Vector3(0, -2, 0);
            ground.receiveShadows = true;

            // COW
            BABYLON.SceneLoader.ImportMesh(
                null,
                '/models/',
                'Cow.glb',
                scene,
                (meshes, particleSystems, skeletons, animationGroups) => {
                    const model = meshes[0];
                    model.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
                    model.position = new BABYLON.Vector3(-0.66, -0.14, 1.00);
                    model.rotation = new BABYLON.Vector3(0.00, -1.59, 0.00);
                    if (animationGroups.length > 0) {
                        animationGroups[0].play(true);
                    }

                    positionGizmo.attachedMesh = model;
                }
            );

            // CARD BOX
            const cardBox = BABYLON.MeshBuilder.CreateBox(
                'myCardBox',
                {
                    width: 2.5,
                    height: 1,
                    depth: 3.5,
                    faceColors: [
                        new BABYLON.Color4(1, 0.2, 0.5, 0.75),
                        new BABYLON.Color4(1, 0.2, 0.5, 0.75),
                        new BABYLON.Color4(1, 0.2, 0.5, 0.75),
                        new BABYLON.Color4(1, 0.2, 0.5, 0.75),
                        new BABYLON.Color4(1, 1, 0.5, 0.75),
                        new BABYLON.Color4(1, 1, 0.5, 0.75)
                    ]
                },
                scene
            );
            cardBox.position.z = 3;
            cardBox.position.x = -3;

            // DETAILED CARD
            const card = BABYLON.MeshBuilder.CreateBox(
                'myCard',
                {
                    width: 0.35,
                    height: 0.005,
                    depth: 0.25,
                    faceUV: [
                        new BABYLON.Vector4(0, 0, 1/114, 1),
                        new BABYLON.Vector4(1/114, 0, 2/114, 1),
                        new BABYLON.Vector4(2/114, 0, 3/114, 1),
                        new BABYLON.Vector4(3/114, 0, 4/114, 1),
                        new BABYLON.Vector4(4/114, 0, 61/114, 1),
                        new BABYLON.Vector4(61/114, 0, 1, 1)
                    ]
                },
                scene
            );

            const cardMaterial = new BABYLON.StandardMaterial('cardMaterial', scene);
            card.material = cardMaterial;
            cardMaterial.diffuseTexture = new BABYLON.Texture('/images/2 of Clubs.png', scene);
            cardMaterial.ambientColor = new BABYLON.Color3(0.7, 0.7, 0.7);
            cardMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);

            card.rotation = new BABYLON.Vector3(0, BABYLON.Tools.ToRadians(60), BABYLON.Tools.ToRadians(165));
            card.position = new BABYLON.Vector3(0, 0, 1);

            // SHADOWS
            const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
            shadowGenerator.setDarkness(0.8);
            shadowGenerator.useBlurExponentialShadowMap = true;
            shadowGenerator.useKernelBlur = true;
            shadowGenerator.blurKernel = 16;
            shadowGenerator.addShadowCaster(card);
            shadowGenerator.addShadowCaster(cardBox);

            // FOG
            scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
            scene.fogDensity = 0.001;
            scene.fogColor = new BABYLON.Color3(0.9, 0.4, 0.4);

            // ANIMATIONS
            const initialValue = 0;
            const newValue = Math.PI;
            const totalDuration = 300;

            BABYLON.Animation.CreateAndStartAnimation(
                'RotateCardBoxAnimation',
                cardBox,
                'rotation.y',
                FPS,
                totalDuration,
                initialValue,
                newValue
            );

            BABYLON.Animation.CreateAndStartAnimation(
                'RotateCardAnimation',
                card,
                'rotation.y',
                FPS,
                totalDuration,
                initialValue,
                newValue,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
                new BABYLON.CircleEase()
            );

            return scene;
        };

        createScene().then(scene => {
            engine.runRenderLoop(() => {
                scene.render();
            });

            const handleResize = () => {
                engine.resize();
            };
            window.addEventListener('resize', handleResize);

            return () => {
                engine.dispose();
                scene.dispose();
                window.removeEventListener('resize', handleResize);
            };
        });

        return () => {
            // Remove no-scroll class from body
            document.body.classList.remove('no-scroll');
        };
    }, []);

    return (
        <div>
            <canvas ref={canvasRef} id="renderCanvas" style={{ width: '100%', height: '100%' }}></canvas>
        </div>
    );
};

export default PokerFrogs;
