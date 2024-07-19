import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function AvatarRenderer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    renderer.setSize(window.innerWidth / 2, window.innerHeight);

    const loader = new GLTFLoader();
    loader.load('/models/2WBEOEWES7W2VGGHG2I4TIL3I.glb', (gltf) => {
      scene.add(gltf.scene);
      
      // Center the model
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      gltf.scene.position.x += (gltf.scene.position.x - center.x);
      gltf.scene.position.y += (gltf.scene.position.y - center.y);
      gltf.scene.position.z += (gltf.scene.position.z - center.z);
      
      // Adjust camera
      camera.position.z = 5;
    }, undefined, (error) => {
      console.error('An error happened', error);
    });

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / 2 / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth / 2, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

export default AvatarRenderer;