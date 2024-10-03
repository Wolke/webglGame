import Maze from './Maze.js';
import Player from './Player.js';
import Treasure from './Treasure.js';

export default class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.player = new Player(this.scene, this.camera);
        this.maze = new Maze(this.scene);
        this.treasures = [];
        this.score = 0;
        this.scoreElement = document.getElementById('score');
        this.ambientLight = null;
        this.directionalLight = null;
        this.brightnessLevels = [0.3, 0.5, 0.7, 1.0];
        this.currentBrightnessIndex = 1;
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.maze.create();
        this.createTreasures();
        this.setupLights();
        this.setupBrightnessButton();

        window.addEventListener('resize', () => this.onWindowResize(), false);
        document.addEventListener('keydown', (event) => this.player.onKeyDown(event), false);
    }

    setupLights() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, this.brightnessLevels[this.currentBrightnessIndex]);
        this.scene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xffffff, this.brightnessLevels[this.currentBrightnessIndex] + 0.3);
        this.directionalLight.position.set(5, 10, 7);
        this.scene.add(this.directionalLight);
    }

    setupBrightnessButton() {
        const brightnessButton = document.getElementById('brightnessButton');
        brightnessButton.addEventListener('click', () => this.adjustBrightness());
    }

    adjustBrightness() {
        this.currentBrightnessIndex = (this.currentBrightnessIndex + 1) % this.brightnessLevels.length;
        const newBrightness = this.brightnessLevels[this.currentBrightnessIndex];
        this.ambientLight.intensity = newBrightness;
        this.directionalLight.intensity = newBrightness + 0.3;
    }

    createTreasures() {
        for (let i = 0; i < 5; i++) {
            const treasure = new Treasure(this.scene);
            this.treasures.push(treasure);
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    updateGame() {
        this.player.checkCollision(this.maze.walls);
        this.collectTreasures();
        this.checkGameEnd();
    }

    collectTreasures() {
        for (let i = this.treasures.length - 1; i >= 0; i--) {
            // 將碰撞距離從 0.6 增加到 0.8，以適應更高的牆壁
            if (this.player.position.distanceTo(this.treasures[i].position) < 0.8) {
                this.scene.remove(this.treasures[i].mesh);
                this.treasures.splice(i, 1);
                this.score++;
                this.scoreElement.textContent = "得分：" + this.score;
            }
        }
    }

    checkGameEnd() {
        if (this.treasures.length === 0) {
            document.getElementById('instructions').textContent = "恭喜！你贏了！按F5重新開始遊戲";
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.updateGame();
        this.renderer.render(this.scene, this.camera);
    }
}