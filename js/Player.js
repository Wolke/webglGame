export default class Player {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.speed = 0.1;
        this.mesh = new THREE.Group();
        this.mesh.add(camera);
        // 將玩家（攝像機）的高度調整到 1.6，這是一個更接近真實人眼高度的值
        this.mesh.position.set(1, 1.6, 1);
        scene.add(this.mesh);
    }

    get position() {
        return this.mesh.position;
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case 37: // 左
                this.mesh.rotation.y += 0.1;
                break;
            case 39: // 右
                this.mesh.rotation.y -= 0.1;
                break;
            case 38: // 上
                this.mesh.translateZ(-this.speed);
                break;
            case 40: // 下
                this.mesh.translateZ(this.speed);
                break;
        }
    }

    checkCollision(walls) {
        for (let wall of walls) {
            if (this.position.distanceTo(wall.position) < 0.6) {
                this.position.copy(this.position.clone().sub(this.mesh.getWorldDirection(new THREE.Vector3()).multiplyScalar(this.speed)));
            }
        }
    }
}