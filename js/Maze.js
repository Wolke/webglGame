export default class Maze {
    constructor(scene) {
        this.scene = scene;
        this.walls = [];
    }

    create() {
        const mazeSize = 10;
        // 修改牆壁的高度為 2
        const wallGeometry = new THREE.BoxGeometry(1, 2, 1);
        const wallMaterial = new THREE.MeshPhongMaterial({
            color: 0xa0522d,
            shininess: 30
        });

        for (let i = 0; i < mazeSize; i++) {
            for (let j = 0; j < mazeSize; j++) {
                if (Math.random() < 0.3 && !(i === 1 && j === 1)) {
                    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                    // 調整牆壁的 y 位置，使其底部與地面齊平
                    wall.position.set(i - mazeSize / 2, 1, j - mazeSize / 2);
                    this.scene.add(wall);
                    this.walls.push(wall);
                }
            }
        }
    }
}