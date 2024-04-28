document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1, -5), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);


    var light_h = new BABYLON.HemisphericLight("light_h", new BABYLON.Vector3(0, 5, -7));
    var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 5, -7), scene);
    light.intensity =1.5;
    light_h.intensity = 1;

    
    var time = 0.;

        
    const xr =  scene.createDefaultXRExperienceAsync({
        // ask for an ar-session
        uiOptions: {
          sessionMode: "immersive-ar",
        },
      });


        BABYLON.SceneLoader.ImportMesh(null, "./asset/", "porte_palais.glb", scene, function (meshes) {
            rocher = meshes[0];
            rocher.position = new BABYLON.Vector3(5, -1,3);
            rocher.scaling.z = 1
            rocher.rotationQuaternion = null;
            rocher.rotation.y = 90 ;
            
            
            
            
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
