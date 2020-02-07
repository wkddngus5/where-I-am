import React, { useEffect } from 'react';
import _ from 'lodash';
import * as THREE from 'three';
import Cube from './Items/Cube';
import Plane from './Items/Plane';
import Sphere from './Items/Sphere';
import './App.css';

// THREE

// SCENE
const scene = new THREE.Scene();

// CAMERA
const cameraPosition = {
  x: 0,
  y: 70,
  z: 40,
}
const camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.x = cameraPosition.x;
camera.position.y = cameraPosition.y;
camera.position.z = cameraPosition.z;
// ( 0, 0, 0 )을 바라본다
camera.lookAt( scene.position );

// PLANE
const plane = new Plane({ scene });
const planeItemLayer = new Plane({
  scene,
  color: 0xFE98A0,
  transparent: true,
  size: {
    x: 2000,
    y: 2000,
  },
  position: {
    x: 0,
    y: 10,
    z: 0,
  }
});

// RAYCASTER
const raycaster = new THREE.Raycaster();

// MOUSE
const mouse = new THREE.Vector2();

// RENDERER
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor( 0xEEEEEE );
renderer.setSize( window.innerWidth * 2, window.innerHeight * 2 );

// AXIS
var axes = new THREE.AxisHelper( 50 );
scene.add(axes);

// SPOTLIGHT
const spotLight = new THREE.SpotLight(0xFFFFFF);
spotLight.position.set(-100,200,30);  
scene.add(spotLight);   

// VARIABLES
const items = {};
let newItem = null;
let selectedItem = null;
let mouseClicked;

// MAKE ITEMS
function makeCube( event ) {
  event.preventDefault();
  const { point } = getIntersect({ event, objects: [ planeItemLayer.mesh ] });
  
  const position = {
    x: point.x,
    y: 10,
    z: point.z,
  }
  newItem = new Cube({ scene, position });
  _.set( items, newItem.mesh.uuid, newItem );
}

function makeSphere( event ) {
  event.preventDefault();
  const { point } = getIntersect({ event, objects: [ planeItemLayer.mesh ] });
  const position = {
    x: point.x,
    y: 10,
    z: point.z,
  }
  newItem = new Sphere({ scene, position });
  _.set( items, newItem.mesh.uuid, newItem );
}

function renderScene() {
  renderer.render(scene, camera);
  requestAnimationFrame(renderScene);
}

// APP
function App() {
  useEffect( () => {
    init();
  }, []);
  
  return (
    <div className="App">

      <button
        className="add-cube"
        onClick={ makeCube }>
        make cube
      </button>

      <button
        className="add-sphere"
        onClick={ makeSphere }>
        make cube
      </button>

      <div id="threejs_scene"></div>
    </div>
  );
}

function init() {
  document.getElementById("threejs_scene").appendChild(renderer.domElement);
  renderScene();

  document.addEventListener( 'mousedown', ( event ) => {
    // 새 아이템 위치
    if ( newItem ) {
      newItem = null;
      return;
    }
    const intersect = getIntersect({ event, objects: _.map( items, item => item.mesh ) });
    if ( intersect ) {
      selectedItem = _.get( items, intersect.object.uuid );
    } else {
      mouseClicked = {
        x: event.offsetX,
        y: event.offsetY,
      }
    }
  } );

  document.addEventListener( 'mouseup', () => {
    setPointer({ type: 'auto' });
    selectedItem = null;
    mouseClicked = null;
    cameraPosition.x = camera.position.x;
    cameraPosition.z = camera.position.z;
  });

  document.addEventListener( 'mousemove', ( event ) => {
    // 새 아이템 위치
    if ( newItem ) {
      const { point } = getIntersect({ event, objects: [ planeItemLayer.mesh ] });
      newItem.move({ x: point.x, z: point.z });
      return;
    }
    // 아이템 이동
    if ( selectedItem ) {
      setPointer({ type: 'grabbing' });
      const { point } = getIntersect({ event, objects: [ planeItemLayer.mesh ] });
      selectedItem.move({ x: point.x, z: point.z });
      return;
    } else if ( getIntersect({ event, objects: _.map( items, item => item.mesh ) }) ) {
      setPointer({ type: 'grab' } );
    } else if ( mouseClicked ) {
      const moveX = ( ( mouseClicked.x - event.offsetX ) / 500 ) * cameraPosition.y;
      const moveZ = ( ( mouseClicked.y - event.offsetY ) / 500 ) * cameraPosition.y;

      const newX = cameraPosition.x + moveX;
      const newZ = _.max([ cameraPosition.z + moveZ, 3 ]);

      camera.position.x = newX;
      camera.position.z = newZ;
    } else {
      setPointer({ type: 'auto' } );
    }

    
  });

  document.addEventListener( 'wheel', ( event ) => {
    const moveY = event.deltaY > 0 ? -0.8 : 0.8;
    const moveZ = event.deltaY > 0 ? -0.8 : 0.8;

    const newY = _.max([ cameraPosition.y + moveY, 20 ]);
    const newZ = cameraPosition.z + moveZ;

    camera.position.y = newY;
    camera.position.z = newZ;

    cameraPosition.y = newY;
    cameraPosition.z = newZ;
  });
}

function getIntersect({ event, objects = [] }) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ( ( event.clientX - rect.left ) / ( rect.width - rect.left ) ) * 2 - 1;
  mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
  raycaster.setFromCamera( mouse, camera );
  const intersects = raycaster.intersectObjects( objects ); 
  if ( intersects.length > 0 ) {
    return intersects[ 0 ]; 
  }
  return null;
}

function setPointer({ type }) {
  document.querySelector( '#root' ).style.cursor = type;
}

export default App;
