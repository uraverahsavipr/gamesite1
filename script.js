let scene, camera, renderer, clock;
let physicsWorld, rigidBodies = [];
let player;

Ammo().then(() => {
    init();
    animate();
});

function init() {
    const container = document.getElementById('game-container');

    // Initialize Three.js scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfd1e5);

    // Initialize camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.8, 5);

    // Initialize renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Initialize clock
    clock = new THREE.Clock();

    // Initialize Ammo.js physics world
    let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    let dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    let overlappingPairCache = new Ammo.btDbvtBroadphase();
    let solver = new Ammo.btSequentialImpulseConstraintSolver();
    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));

    // Add ground
    createGround();

    // Add player character
    createPlayer();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function createGround() {
    let pos = {x: 0, y: -0.5, z: 0};
    let scale = {x: 50, y: 1, z: 50};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 0;

    let ground = createBox(pos, scale, quat, mass, new THREE.MeshPhongMaterial({color: 0x878787}));
    ground.receiveShadow = true;
}

function createPlayer() {
    let pos = {x: 0, y: 5, z: 0};
    let scale = {x: 1, y: 2, z: 1};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 1;

    player = createBox(pos, scale, quat, mass, new THREE.MeshPhongMaterial({color: 0x0000ff}));
    player.castShadow = true;
    player.position.y = 1;
}

function createBox(pos, scale, quat, mass, material) {
    let boxGeometry = new THREE.BoxGeometry();
    let boxMesh = new THREE.Mesh(boxGeometry, material);
    boxMesh.position.set(pos.x, pos.y, pos.z);
    boxMesh.scale.set(scale.x, scale.y, scale.z);
    boxMesh.quaternion.set(quat.x, quat.y, quat.z, quat.w);
    scene.add(boxMesh);

    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    let motionState = new Ammo.btDefaultMotionState(transform);

    let colShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
    colShape.setMargin(0.05);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    if (mass !== 0) {
        colShape.calculateLocalInertia(mass, localInertia);
    }

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
    let rigidBody = new Ammo.btRigidBody(rbInfo);

    physicsWorld.addRigidBody(rigidBody);

    boxMesh.userData.physicsBody = rigidBody;
    rigidBodies.push(boxMesh);

    return boxMesh;
}

function animate() {
    requestAnimationFrame(animate);
    let deltaTime = clock.getDelta();
    updatePhysics(deltaTime);
    renderer.render(scene, camera);
}

function updatePhysics(deltaTime) {
    physicsWorld.stepSimulation(deltaTime, 10);

    for (let i = 0; i < rigidBodies.length; i++) {
        let objThree = rigidBodies[i];
        let objAmmo = objThree.userData.physicsBody;
        let ms = objAmmo.getMotionState();
        if (ms) {
            ms.getWorldTransform(tmpTrans);
            let p = tmpTrans.getOrigin();
            let q = tmpTrans.getRotation();
            objThree.position.set(p.x(), p.y(), p.z());
            objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
        }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

let tmpTrans = new Ammo.btTransform();
