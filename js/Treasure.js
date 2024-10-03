export default class Treasure {
    constructor(scene) {
        const geometry = new THREE.SphereGeometry(0.2, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffd700,
            shininess: 100,
            emissive: 0xffd700,
            emissiveIntensity: 0.5
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(
            Math.random() * 10 - 5,
            0.2,
            Math.random() * 10 - 5
        );
        scene.add(this.mesh);
    }

    get position() {
        return this.mesh.position;
    }
}