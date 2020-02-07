import * as THREE from 'three';
import Item from './Item';

class Sphere extends Item {
    step = 0;
    constructor({
        position = { x: -15, y: 2, z: 0 },
        size = { x: 4, y: 32, z: 32 },
        color = 0xFE98A0,
        scene,
    }) {
        const geometry = new THREE.SphereGeometry( size.x, size.y, size.z );
        super({ position, geometry, color, scene } );
    }
    getGeometry({ size = { x: 6, y: 6, z: 6 } }) {
        return new THREE.BoxGeometry( size.x, size.y, size.z );
    }
    getCenter() {
        return this.position;
    }
}

export default Sphere;