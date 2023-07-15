import React, { useRef } from 'react';
import { GLView } from 'expo-gl';
import { TextureLoader, PerspectiveCamera, Scene, AmbientLight, AxesHelper } from 'three';
import { Renderer } from 'expo-three';
import { Asset } from 'expo-asset';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export default class App extends React.Component {
  modelRef = React.createRef();
  touchStart = { x: 0, y: 0 };

  render() {
    return (
      <GLView
        style={{ flex: 1 }}
        onContextCreate={this._onGLContextCreate}
        onTouchStart={this._onTouchStart}
        onTouchMove={this._onTouchMove}
      />
    );
  }

  _onGLContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
     renderer.setSize(width, height);
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 10;
    camera.position.y = 3;
    const axesHelper = new AxesHelper(5);
    scene.add(axesHelper);

    const modelAsset = Asset.fromModule(require('./assets/models/rim.obj'));
    await modelAsset.downloadAsync();
    const loader = new OBJLoader();

    loader.load(
      modelAsset.localUri,
      group => {
        scene.add(group);
        this.modelRef.current = group;
      },
      progress => {
        console.log(`Model loading: ${(progress.loaded / progress.total) * 100}% loaded`);
      },
      error => {
        console.error('An error happened', error);
      },
    );

    const render = () => {
      requestAnimationFrame(render);
      if (this.modelRef.current) {
        const { x, y } = this.touchStart;
        this.modelRef.current.rotation.x = -(y - window.innerHeight / 2) * 0.01; // Rotate around the X-axis
        this.modelRef.current.rotation.y = (x - window.innerWidth / 2) * 0.01; // Rotate around the Y-axis
      }
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    render();
  };

  _onTouchStart = event => {
    const { locationX, locationY } = event.nativeEvent;
    this.touchStart = { x: locationX, y: locationY };
  };

  _onTouchMove = event => {
    const { locationX, locationY } = event.nativeEvent;
    this.touchStart = { x: locationX, y: locationY };
  };
}
