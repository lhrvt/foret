document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1, -5), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);


    var hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);

// Définir les couleurs pour la partie supérieure et inférieure de la sphère
        hemiLight.diffuse = new BABYLON.Color3(0.5, 0.2, 0.2); // Couleur diffuse pour la partie supérieure
        hemiLight.groundColor = new BABYLON.Color3(1, 1, 1); // Couleur diffuse pour la partie inférieure
        hemiLight.intensity = 0.4;

        var sunLight = new BABYLON.DirectionalLight("sunLight", new BABYLON.Vector3(0, -1, 0), scene);
        sunLight.position = new BABYLON.Vector3(0, 10, 0); // Positionner la lumière
        sunLight.intensity =7;

                // Définir la couleur et l'intensité de la lumière
        sunLight.diffuse = new BABYLON.Color3(1, 1, 1); // Couleur blanche
        

// Activer les ombres pour la lumière directionnelle
        sunLight.shadowEnabled = true;
    
    var time = 0;

        
    const xr =  scene.createDefaultXRExperienceAsync({
        // ask for an ar-session
        uiOptions: {
          sessionMode: "immersive-ar",
        },
      });


            


        BABYLON.SceneLoader.ImportMesh(null, "./asset/", "terrain.glb", scene, function (meshes) {
            rocher = meshes[0];
            rocher.position = new BABYLON.Vector3(5, -25,3);
            
            rocher.scaling.z = 1
            rocher.rotationQuaternion = null;
            rocher.rotation.y = 90 ;
            rocher.receiveShadows = true;
            rocher.castShadow = true;
            
            
            
            
        });
        console.log(sunLight.direction)
            function updateLightRotation() {
                
                

                time += 0.01;
                sunLight.direction.x += Math.sin(time) *  0.0010;
                sunLight.direction.y += Math.cos(time) *  0.0010;
                //console.log(sunLight.direction)
            }
        
        scene.onPointerObservable.add(function(eventData) {
            if (eventData.type === BABYLON.PointerEventTypes.POINTERDOWN) {

                var clic_obj = eventData.pickInfo.pickedMesh;
        
                if (clic_obj) {
                    console.log("Vous avez cliqué sur le mesh : ", clic_obj.name);
                }
            }
        });
    
        engine.runRenderLoop(function () {

            updateLightRotation();
            scene.render();
            
           
            
        });

        window.addEventListener("resize", function () {
            engine.resize();
        });
    });
