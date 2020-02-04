import THREELib from 'three-js';
import Item from './Item';

const THREE = THREELib();

class Plane extends Item {
    constructor({
        position = { x: 0, y: 0, z: 0 },
        size = { x: 450, y: 250, segmentX: 1, segmentY: 1 },
        color = 0xCCCCCC,
        transparent,
        scene,
    }) {
        const geometry = new THREE.PlaneGeometry( size.x, size.y, size.segmentX, size.segmentY );
        super({ position, geometry, color, transparent, scene } );
        this.mesh.rotation.x = -0.5 * Math.PI;
    }
    getGeometry({ size = { x: 6, y: 6, z: 6 } }) {
        return new THREE.BoxGeometry( size.x, size.y, size.z );
    }
}

export default Plane;