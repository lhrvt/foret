document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    var particleSystemEtat = false

    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1, -5), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    
    
    camera.attachControl(canvas, true);

    var light_h = new BABYLON.HemisphericLight("light_h");
    var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 0, 0), scene);
    light.intensity = 0;
    light_h.intensity = 0.7;

    
    var time = 0.;

    var createScene = async function () {
        
    const xr = await scene.createDefaultXRExperienceAsync({
        // ask for an ar-session
        uiOptions: {
          sessionMode: "immersive-ar",
        },
      });
      return scene;
    }

    BABYLON.Effect.ShadersStore['customVertexShader'] = `
        precision highp float;

        attribute vec3 position;
        attribute vec3 normal;

        uniform mat4 worldViewProjection;

        varying vec3 vNormal;

        void main(void) {
            // Pass the normal to the fragment shader
            vNormal = normal;

            // Calculate the position of the vertex
            gl_Position = worldViewProjection * vec4(position, 1.0);
        }
    `;
    BABYLON.Effect.ShadersStore['custombrownFragmentShader'] = `
    precision highp float;

    // Varyings
        
    varying vec3 vNormal;
    uniform float time;

    void main(void) {
        vec3 normal = normalize(vNormal);
        vec3 light = vec3(0.1 * time, 0.1, 1.0);
        
        float intensity = dot(normal, light);


        if (intensity > 0.6) {

            gl_FragColor = vec4(0.4 , 0.2, 0.0, 1.0 );
        } else if (intensity > 0.2) {

            gl_FragColor = vec4(0.4, 0.2, 0.0, 0.7);
        } else {

            gl_FragColor = vec4(0.4, 0.2, 0.0, 0.5);
        }
    }
`;
    BABYLON.Effect.ShadersStore['customwhiteFragmentShader'] = `
    precision highp float;

    // Varyings
    varying vec3 vNormal;
    uniform float time;

    void main(void) {

        vec3 normal = normalize(vNormal);
        vec3 lightDir = vec3(0.5* time, 0.5 , 1.0);
        float intensity = dot(normal, lightDir);

        if (intensity > 0.6) {
        
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.7);
        } else if (intensity > 0.4) {
            
            gl_FragColor = vec4(0.4, 0.4, 0.4, 0.7);
        } else if (intensity > 0.2) {
            
            gl_FragColor = vec4(0.4, 0.4, 0.4, 0.5);
        }else {
            
            gl_FragColor = vec4(0.2, 0.2, 0.2, 0.2);
        }
    }
    `;

    BABYLON.Effect.ShadersStore['customchocoFragmentShader'] = `
    precision highp float;

    // Varyings
    varying vec3 vNormal;
    uniform float time;

    void main(void) {

        vec3 normal = normalize(vNormal);
        vec3 lightDir = vec3(0.5* time, 0.5 , 1.0);
        float intensity = dot(normal, lightDir);

        if (intensity > 0.6) {
        
            gl_FragColor = vec4(0.3, 0.1, 0.0, 1.0);
        } else if (intensity > 0.4) {
            
            gl_FragColor = vec4(0.3, 0.1, 0.0, 1.0);
        } else if (intensity > 0.2) {
            
            gl_FragColor = vec4(0.3, 0.1, 0.0, 0.8);
        }else {
            
            gl_FragColor = vec4(0.3, 0.1, 0.0, 0.7);
        }
    }
    `;
    var white_toon = new BABYLON.ShaderMaterial('toonShader', scene, {
        vertex: 'custom',
        fragment: 'customwhite',
    }, {
        needAlphaBlending: false,
        needAlphaTesting: false,
        attributes: ['position', 'normal'],
        uniforms: ['worldViewProjection'],
        baseColor: new BABYLON.Vector3(0.2, 1, 1) // Couleur de base blanche

    });
    
    var brown_toon = new BABYLON.ShaderMaterial('toonShader', scene, {
        vertex: 'custom',
        fragment: 'custombrown',
    }, {
        needAlphaBlending: false,
        needAlphaTesting: false,
        attributes: ['position', 'normal'],
        uniforms: ['worldViewProjection', 'time'],
    });

    var choco_toon = new BABYLON.ShaderMaterial('toonShader', scene, {
        vertex: 'custom',
        fragment: 'customchoco',
    }, {
        needAlphaBlending: false,
        needAlphaTesting: false,
        attributes: ['position', 'normal'],
        uniforms: ['worldViewProjection', 'time'],
    });

    

    
        var muffinMesh;
        var muffinMesh2;

        BABYLON.SceneLoader.ImportMesh(null, "./asset/", "muffin.glb", scene, function (meshes) {
            muffinMesh = meshes[0];
            muffinMesh.position = new BABYLON.Vector3(2, -2, 10);
            
            checkMat(meshes[2], brown_toon)
            checkMat(meshes[5], white_toon)
            muffinMesh.scaling.z = 1
            muffinMesh.rotation.x += 0.1;
            
            
            
            
        });
        BABYLON.SceneLoader.ImportMesh(null, "./asset/", "muffin_2.glb", scene, function (meshes) {
            // parent
            muffinMesh2 = meshes[0];
           
            muffinMesh2.position = new BABYLON.Vector3(-2, -2, 10);
            
            checkMat(meshes[1], choco_toon)
            checkMat(meshes[5], white_toon)
            
            
            muffinMesh2.scaling.z = 1
            muffinMesh2.rotation.x += 0.2;
            
            
            
            
        });

        function particlesparameter (emit){
            
           
            var particleSystem = new BABYLON.ParticleSystem("particles", 22, scene);
            particleSystem.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", scene);
            particleSystem.emitter = emit
            
            // Définir les paramètres du système de particules
            particleSystem.capacity = 150;
            particleSystem.minEmitBox = new BABYLON.Vector3(0.0, 1, 0); // La boîte d'émission minimum
            particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 1, 0); // La boîte d'émission maximum
            particleSystem.color1 = new BABYLON.Color4(1,1, 1, 1); // Couleur de départ
            particleSystem.color2 = new BABYLON.Color4(1, 0, 0, 0.2); // Couleur de fin
            particleSystem.minSize = 0.2; // Taille minimale des particules
            particleSystem.maxSize = 0.9; // Taille maximale des particules
            particleSystem.minLifeTime = 0.5; // Durée de vie minimale des particules
            particleSystem.maxLifeTime = 1.0; // Durée de vie maximale des particules
            particleSystem.emitRate = 20000; // Taux d'émission des particules
            particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE; // Mode de mélange
            particleSystem.gravity = new BABYLON.Vector3(0, 9.81, 0); // Gravité

            // Définir l'effet de particules
            particleSystem.minAngularSpeed = -Math.PI; // Vitesse angulaire minimale
            particleSystem.maxAngularSpeed = Math.PI; // Vitesse angulaire maximale
            particleSystem.minInitialRotation = 0; // Rotation initiale minimale
            particleSystem.maxInitialRotation = Math.PI; // Rotation initiale maximale
            particleSystem.minAngularSpeed = -Math.PI; // Vitesse angulaire minimale
            particleSystem.maxAngularSpeed = Math.PI; // Vitesse angulaire maximale
            particleSystem.direction1 = new BABYLON.Vector3(-1, 1, -1); // Direction 1
            particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1); // Direction 2
            particleSystem.targetStopDuration = 0.5;
            particleSystem.start();

            particleSystem.onAnimationEnd = function() {
                particleSystemEtat = false;
                console.log(particleSystemEtat);
            };

            // Définir les comportements des particules
        }

        function checkMat(mesh, mat){

                if (mesh.subMeshes) {
                    for (var i = 0; i < mesh.subMeshes.length; i++) { 
                        var subMesh = mesh.subMeshes[i];
                        var material = subMesh.getMaterial();
                        console.log(material.name)
                        if (material) {
                            mesh.material = mat
                        }
                    }
                } else {
                    console.log("Le mesh n'a pas de sous-meshes avec des matériaux différents.");
                }
            }
    
            function updateLightRotation() {
                if (light) {
                    light.position.x = Math.sin(Date.now() * 0.0010) * 10; 
                    light.position.z = Math.cos(Date.now() * 0.0010) * 10;
                }
            }

            function updateRotation(mesh, va) {
                if (mesh) {
                    mesh.rotationQuaternion = null // Pour pouvoir rotate en euler
                    mesh.rotation.y += va;
                    mesh.rotation.x += 0.00008;
                }
            }
            function effectuerRebond(mesh) {
                // Animation d'échelle avec GSAP
                gsap.to(mesh.scaling, {
                    duration: 0.2,
                    x: mesh.scaling.x - 0.2,
                    y: mesh.scaling.y - 0.2,
                    z: mesh.scaling.z - 0.2,
                    ease: "power1.inOut",
                    yoyo: true,
                    
                    repeat: 1, // Nombre de fois que l'animation doit être répétée (une fois dans ce cas)
                    onComplete: function() {
                        // À la fin de l'animation, revenir à l'échelle normale
                        gsap.to(mesh.scaling, {
                            duration: 0.3,
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "power1.inOut"
                        });
                        
                    }
                });
            }
            
        
        scene.onPointerObservable.add(function(eventData) {
            if (eventData.type === BABYLON.PointerEventTypes.POINTERDOWN) {

                var clic_obj = eventData.pickInfo.pickedMesh;
        
                if (clic_obj) {
                    console.log("Vous avez cliqué sur le mesh : ", clic_obj.name);
                    if (!particleSystemEtat) {
                    particleSystemEtat = true; //Annule la poss de relancer les particles
                        console.log(clic_obj);
                        particleSystem = particlesparameter(clic_obj)
                        
                        effectuerRebond(clic_obj.parent)
    
                    }
                }
            }
        });


        scene.registerBeforeRender(function() {
            brown_toon.setFloat("time", time); 
            white_toon.setFloat("time", time);
            time += Math.cos(Date.now() * 0.0010) * 0.10;        
        });
    
        engine.runRenderLoop(function () {
            scene.render();

            updateRotation(muffinMesh, 0.008);
            updateRotation(muffinMesh2, -0.008);
            updateLightRotation();
            
           
            
        });

        window.addEventListener("resize", function () {
            engine.resize();
        });
    });
