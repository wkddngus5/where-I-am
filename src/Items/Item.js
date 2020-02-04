import THREELib from 'three-js';

const THREE = THREELib();

class Item {
    position;
    mesh;
    constructor({ position, geometry, color, transparent = false, scene }) {
        this.position = position;
        const material = new THREE.MeshPhongMaterial({ color, transparent, opacity: 0 });  
        this.mesh = new THREE.Mesh( geometry, material );
        this.mesh.position.x = position.x;
        this.mesh.position.y = position.y;
        this.mesh.position.z = position.z;
        this.mesh.updateMatrixWorld();
        scene.add( this.mesh );
    }

    move({ x, y = 10, z }) {
        this.position = { x, y, z };
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
    }
}

export default Item;