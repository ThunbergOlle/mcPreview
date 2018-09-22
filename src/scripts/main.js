const electron = require('electron');
const ips = electron.ipcRenderer;
let socket = io.connect('http://127.0.0.1:4000/');
let renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("mainCanvas"), antialias: true });
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a camera
// PERSPECTIVE CAMERA
let camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 30, 0);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 5, 0);
let scene = new THREE.Scene();

// ADDING CONTENT TO THE SCREEN
// Create MESH, GEOMETRY & MATERIAL
let geometry = new THREE.BoxGeometry(100, 100, 100);

// Add lights to the scene
let light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);


loadSkin = () => {
    let loader = new THREE.ObjectLoader();
    loader.load('./models/steve.json', function (obj) {
        obj.name = "model";
        scene.add(obj);
        obj.position.set(0, 0, 0)
        render(obj);
        socket.on('skinInputSuccess', function (data) {
            console.log(data.success);
            obj.material.map = THREE.ImageUtils.loadTexture('steve.png');
            obj.material.needsUpdate = true;
        });
    });
}
loadBlock = () => {
    let geom = new THREE.BoxGeometry(4, 4, 4);
    let material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('./models/block.png'),
    });
    let mesh = new THREE.Mesh(geom, material);
    mesh.material.map = THREE.ImageUtils.loadTexture("./models/block.png");
    mesh.material.needsUpdate = true;
    mesh.name = "model"
    mesh.position.set(0, 5, 0)
    scene.add(mesh);

}
loadSkin();
function clearObject() {
    console.log('Clearing scene....')
    let model = scene.getObjectByName("model");
    scene.remove(model);
}
socket.on('loadBlock', function (data) {
    console.log("We want to load the block model");
    clearObject();
    loadBlock();
});

function render() {
    controls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);

}
