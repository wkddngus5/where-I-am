import * as THREE from 'three';
import Item from './Item';

class Cube extends Item {
    constructor({
        position = { x: 0, y: 10, z: 0 },
        size = { x: 6, y: 6, z: 6 },
        color = 0x0089A0,
        scene,
    }) {
        const geometry = new THREE.BoxGeometry( size.x, size.y, size.z );
        super({ position, geometry, color, scene } );
    }
    getGeometry({ size = { x: 6, y: 6, z: 6 } }) {
        return new THREE.BoxGeometry( size.x, size.y, size.z );
    }
}

export default Cube;