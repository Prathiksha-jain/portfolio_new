import React, {
  useRef,
} from "react";

import {
  useFrame,
} from "@react-three/fiber";

import {
  Sparkles,
} from "@react-three/drei";

import * as THREE from "three";

import Avatar from "./Avatar";


/*
============================================================
 ORBITAL RING
============================================================
*/

function OrbitalRing({
  radius,
  rotation,
  speed,
}) {

  const ref =
    useRef();

  useFrame((state) => {

    const time =
      state.clock.getElapsedTime();

    if (!ref.current) {
      return;
    }

    ref.current.rotation.y =
      time * speed;

    ref.current.rotation.z =
      rotation[2] +
      Math.sin(
        time * 0.35
      ) * 0.035;
  });


  return (
    <mesh
      ref={ref}
      rotation={rotation}
      renderOrder={8}
    >

      <torusGeometry
        args={[
          radius,
          0.008,
          12,
          180,
        ]}
      />

      <meshBasicMaterial
        color="#9a82ff"
        transparent
        opacity={0.82}
        depthWrite={false}
      />

    </mesh>
  );
}


/*
============================================================
 GLOWING ORB
============================================================
*/

function FloatingOrb({
  position,
  size = 0.1,
}) {

  const ref =
    useRef();

  useFrame((state) => {

    const time =
      state.clock.getElapsedTime();

    if (!ref.current) {
      return;
    }

    ref.current.position.y =
      position[1] +
      Math.sin(
        time * 1.4
      ) * 0.08;
  });


  return (
    <mesh
      ref={ref}
      position={position}
      renderOrder={10}
    >

      <sphereGeometry
        args={[
          size,
          32,
          32,
        ]}
      />

      <meshStandardMaterial
        color="#8b76ff"
        emissive="#5b43ff"
        emissiveIntensity={5}
        metalness={0.5}
        roughness={0.15}
      />

    </mesh>
  );
}


/*
============================================================
 MAIN HERO 3D SCENE
============================================================
*/

export default function Character3D() {

  const scene =
    useRef();


  useFrame((state) => {

    if (!scene.current) {
      return;
    }

    const mouseX =
      state.pointer.x;

    const mouseY =
      state.pointer.y;


    /*
      Entire environment responds
      slightly to cursor.
    */

    scene.current.rotation.y =
      THREE.MathUtils.lerp(
        scene.current.rotation.y,
        mouseX * 0.035,
        0.035
      );

    scene.current.rotation.x =
      THREE.MathUtils.lerp(
        scene.current.rotation.x,
        -mouseY * 0.018,
        0.035
      );

  });


  return (
    <group ref={scene}>

      {/* =================================================
          YOUR ACTUAL AVATAR
      ================================================= */}

      <Avatar />


      {/* =================================================
          ORBITAL RINGS
      ================================================= */}

      <OrbitalRing
        radius={2.5}
        rotation={[
          Math.PI / 2.4,
          0.1,
          0.3,
        ]}
        speed={0.08}
      />

      <OrbitalRing
        radius={2.8}
        rotation={[
          Math.PI / 2.8,
          -0.3,
          -0.2,
        ]}
        speed={-0.055}
      />


      {/* =================================================
          ORBITAL OBJECTS
      ================================================= */}

      <FloatingOrb
        position={[
          2.35,
          0.8,
          0.2,
        ]}
        size={0.12}
      />

      <FloatingOrb
        position={[
          -2.1,
          0.1,
          0,
        ]}
        size={0.08}
      />

      <FloatingOrb
        position={[
          1.6,
          -1.6,
          0,
        ]}
        size={0.065}
      />


      {/* =================================================
          PARTICLES
      ================================================= */}

      <Sparkles
        count={130}
        scale={[
          6,
          5.5,
          4,
        ]}
        size={1.4}
        speed={0.18}
        opacity={0.65}
        color="#b9adff"
      />

    </group>
  );
}