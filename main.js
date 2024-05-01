document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1, -5), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);


   var light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 200, 0), new BABYLON.Vector3(0, -1, 0), Math.PI / 4, 2, scene);
light.intensity = 50000*7; // Intensité de la lumière
light.diffuse = new BABYLON.Color3(1, 1, 1); // Couleur diffuse de la lumière
light.specular = new BABYLON.Color3(1, 1, 1); // Couleur spéculaire de la lumière

    var hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);

// Définir les couleurs pour la partie supérieure et inférieure de la sphère
        hemiLight.diffuse = new BABYLON.Color3(0.5, 0.2, 0.2); // Couleur diffuse pour la partie supérieure
        hemiLight.groundColor = new BABYLON.Color3(0.5, 0.5, 0.5); // Couleur diffuse pour la partie inférieure
        hemiLight.intensity = 0.5;
    
    var time = 0;

        
    const xr =  scene.createDefaultXRExperienceAsync({
        // ask for an ar-session
        uiOptions: {
          sessionMode: "immersive-ar",
        },
      });

        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
            shadowGenerator.usePoissonSampling = true;
            shadowGenerator.useBlurVarianceShadowMap = true;
            


        BABYLON.SceneLoader.ImportMesh(null, "./asset/", "terrain.glb", scene, function (meshes) {
            rocher = meshes[0];
            rocher.position = new BABYLON.Vector3(5, -10,3);
            
            rocher.scaling.z = 1
            rocher.rotationQuaternion = null;
            rocher.rotation.y = 90 ;
            rocher.receiveShadows = true;
            
            
            
            
        });

            function updateLightRotation() {
                if (light) {
                    light.position.x = Math.sin(Date.now() * 0.0010) * 10; 
                    light.position.z = Math.cos(Date.now() * 0.0010) * 10;
                }
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
            scene.render();
           
            
        });

        window.addEventListener("resize", function () {
            engine.resize();
        });
    });
