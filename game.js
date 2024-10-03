let scene, camera, renderer, player, maze, treasures;
let playerSpeed = 0.1;
let collisionDistance = 0.6;
let score = 0;
let scoreElement;

function init() {
    // 初始化場景
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 修改相機位置和玩家創建
    player = new THREE.Group();
    player.add(camera);
    scene.add(player);
    player.position.set(1, 0.5, 1);

    // 創建迷宮
    createMaze();

    // 創建寶藏
    createTreasures();

    // 修改光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // 移除原來的點光源
    // const light = new THREE.PointLight(0xffffff, 1, 100);
    // light.position.set(0, 0, 10);
    // scene.add(light);

    // 開始遊戲循環
    animate();

    // 在 init 函數中添加：
    scoreElement = document.getElementById('score');

    // 添加窗口大小變化的監聽器
    window.addEventListener('resize', onWindowResize, false);
}

// 添加窗口大小變化的處理函數
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function createMaze() {
    maze = [];
    const mazeSize = 10;
    const wallGeometry = new THREE.BoxGeometry(1, 1, 1);
    // 修改牆壁材質，使其更亮
    const wallMaterial = new THREE.MeshPhongMaterial({
        color: 0xa0522d,
        shininess: 30
    });

    for (let i = 0; i < mazeSize; i++) {
        for (let j = 0; j < mazeSize; j++) {
            if (Math.random() < 0.3 && !(i === 1 && j === 1)) {
                const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                wall.position.set(i - mazeSize / 2, 0, j - mazeSize / 2);
                scene.add(wall);
                maze.push(wall);
            }
        }
    }
}

function createTreasures() {
    treasures = [];
    const treasureGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    // 修改寶藏材質，使其更亮
    const treasureMaterial = new THREE.MeshPhongMaterial({
        color: 0xffd700,
        shininess: 100,
        emissive: 0xffd700,
        emissiveIntensity: 0.5
    });

    for (let i = 0; i < 5; i++) {
        const treasure = new THREE.Mesh(treasureGeometry, treasureMaterial);
        treasure.position.set(
            Math.random() * 10 - 5,
            0.2,
            Math.random() * 10 - 5
        );
        scene.add(treasure);
        treasures.push(treasure);
    }
}

function animate() {
    requestAnimationFrame(animate);
    // 更新遊戲邏輯
    updateGame();
    renderer.render(scene, camera);
}

function updateGame() {
    // 碰撞檢測
    for (let wall of maze) {
        if (player.position.distanceTo(wall.position) < collisionDistance) {
            player.position.copy(player.position.clone().sub(player.getWorldDirection(new THREE.Vector3()).multiplyScalar(playerSpeed)));
        }
    }

    // 寶藏收集
    for (let i = treasures.length - 1; i >= 0; i--) {
        if (player.position.distanceTo(treasures[i].position) < collisionDistance) {
            scene.remove(treasures[i]);
            treasures.splice(i, 1);
            score++;
            scoreElement.textContent = "得分：" + score;
        }
    }

    // 檢查遊戲是否結束
    if (treasures.length === 0) {
        document.getElementById('instructions').textContent = "恭喜！你贏了！按F5重新開始遊戲";
    }
}

// 處理鍵盤輸入
document.addEventListener('keydown', onKeyDown, false);

function onKeyDown(event) {
    switch (event.keyCode) {
        case 37: // 左
            player.rotation.y += 0.1;
            break;
        case 39: // 右
            player.rotation.y -= 0.1;
            break;
        case 38: // 上
            player.translateZ(-playerSpeed);
            break;
        case 40: // 下
            player.translateZ(playerSpeed);
            break;
    }
}

// 初始化遊戲
init();