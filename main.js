function init(){
    var scene = new THREE.Scene();
    
    var gui = new dat.GUI();
    
 
    var camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth/window.innerHeight,
        1,
        1000
    );
    
    camera.position.z = 7;
	camera.position.x = -2;
	camera.position.y = 7;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
    
    var particleGeo = new THREE.Geometry();
    var particelMat = new THREE.PointsMaterial({
        color : 'rgb(255,255,255)',
        size: 1,
        map : new THREE.TextureLoader().load('assets/texture/particle.jpg'),
        transparent : true,
        blending : THREE.AdditiveBlending,
        depthWrite : false
        
    });
    
    var particleCount = 20000;
    var particleDistance = 100;
    
    for(var i = 0; i < particleCount; i++){
        var posX = (Math.random() - 0.5) * particleDistance;
        var posY = (Math.random() - 0.5) * particleDistance;
        var posZ = (Math.random() - 0.5) * particleDistance;
        var particle = new THREE.Vector3(posX, posY, posZ);
        
        particleGeo.vertices.push(particle);
    }
    
    var particleSystem = new THREE.Points(
        particleGeo,
        particelMat
    );
    
    particleSystem.name = 'particleSystem';
    
    scene.add(particleSystem);
    
    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('webgl').appendChild(renderer.domElement);
    
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    update(renderer, scene, camera, controls);
    
    return scene;
}


function getSpotLight(intensity, color){
    color === undefined ? 'rgb(255,255,255)' : color
    var light = new THREE.SpotLight( 'rgb(255,255,255)' ,intensity);
    light.castShadow = true;  
    light.penumbra = 0.5;
    
    //Set up shadow properties for the light
	light.shadow.mapSize.width = 2048;  // default: 512
	light.shadow.mapSize.height = 2048; // default: 512
    light.shadow.bias = 0.001;
    
    return light;
}

function update(renderer, scene, camera, controls){
    renderer.render(
        scene,
        camera
    );
    var particleSystem = scene.getObjectByName('particleSystem');
    particleSystem.rotation.x += 0.005;
    particleSystem.rotation.y += 0.005;
    
    particleSystem.geometry.vertices.forEach(function(particle){
        particle.x += (Math.random() - 1) * 0.1;
        particle.y += (Math.random() - 0.75) * 0.1;
        particle.z += (Math.random()) * 0.1;
        
        if(particle.x < -50){
            particle.x = 50;
        }
        if(particle.y < -50){
            particle.y = 50
        }
        if(particle.z < -50){
            particle.z = 50;
        }
        
        if(particle.z > 50){
            particle.z = -50;
        }
    });
    
    particleSystem.geometry.verticesNeedUpdate = true;
    
    controls.update();
    
    
    
    
    requestAnimationFrame(function(){
        update(renderer, scene, camera, controls);
    });
}

var scene = init();
