import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useFrame,
} from "@react-three/fiber";

import * as THREE from "three";

const AVATAR_SRC = `${import.meta.env.BASE_URL}images/prathiksha-avatar.png`;


/*
============================================================
 REMOVE WHITE BACKGROUND
============================================================
*/

function removeWhiteBackground(image) {
  const canvas =
    document.createElement("canvas");

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context =
    canvas.getContext("2d", {
      willReadFrequently: true,
    });

  context.drawImage(
    image,
    0,
    0
  );

  const imageData =
    context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

  const pixels =
    imageData.data;

  for (
    let i = 0;
    i < pixels.length;
    i += 4
  ) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    /*
      Detect white / near-white background.
    */

    const brightness =
      (r + g + b) / 3;

    const maxChannel =
      Math.max(r, g, b);

    const minChannel =
      Math.min(r, g, b);

    const isWhite =
      brightness > 238 &&
      maxChannel - minChannel < 18;

    if (isWhite) {
      pixels[i + 3] = 0;
    }

    /*
      Soften pixels near the white background.
      This prevents a harsh white halo
      around hair and shoulders.
    */

    else if (
      brightness > 215 &&
      maxChannel - minChannel < 25
    ) {
      const alpha =
        Math.max(
          0,
          Math.min(
            255,
            (245 - brightness) * 8
          )
        );

      pixels[i + 3] =
        Math.min(
          pixels[i + 3],
          alpha
        );
    }
  }

  context.putImageData(
    imageData,
    0,
    0
  );

  return canvas;
}


/*
============================================================
 AVATAR
============================================================
*/

export default function Avatar() {
  const group = useRef();

  const [texture, setTexture] =
    useState(null);

  const [aspect, setAspect] =
    useState(0.75);


  /*
  ==========================================================
   LOAD IMAGE
  ==========================================================
  */

  useEffect(() => {
    const image =
      new Image();

    image.src =
      AVATAR_SRC;

    image.onload = () => {

      const canvas =
        removeWhiteBackground(
          image
        );

      const texture =
        new THREE.CanvasTexture(
          canvas
        );

      texture.colorSpace =
        THREE.SRGBColorSpace;

      texture.minFilter =
        THREE.LinearFilter;

      texture.magFilter =
        THREE.LinearFilter;

      texture.needsUpdate =
        true;

      setTexture(texture);

      setAspect(
        canvas.width /
        canvas.height
      );
    };

    image.onerror = () => {
      console.error(
        "Could not load avatar image."
      );
    };

  }, []);


  /*
  ==========================================================
   MOUSE INTERACTION
  ==========================================================
  */

  useFrame((state) => {

    if (!group.current) {
      return;
    }

    const mouseX =
      state.pointer.x;

    const mouseY =
      state.pointer.y;


    /*
      Horizontal head/body reaction
    */

    const targetRotationY =
      mouseX * 0.12;

    /*
      Vertical reaction
    */

    const targetRotationX =
      -mouseY * 0.045;


    group.current.rotation.y =
      THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetRotationY,
        0.06
      );

    group.current.rotation.x =
      THREE.MathUtils.lerp(
        group.current.rotation.x,
        targetRotationX,
        0.06
      );


    /*
      Small horizontal parallax
    */

    const targetX =
      mouseX * 0.18;

    group.current.position.x =
      THREE.MathUtils.lerp(
        group.current.position.x,
        targetX,
        0.045
      );


    /*
      Small vertical parallax
    */

    const targetY =
      -0.75 +
      mouseY * 0.08;

    group.current.position.y =
      THREE.MathUtils.lerp(
        group.current.position.y,
        targetY,
        0.045
      );


    /*
      Subtle breathing / floating
    */

    const time =
      state.clock.getElapsedTime();

    group.current.position.y +=
      Math.sin(time * 1.2) *
      0.008;
  });


  if (!texture) {
    return null;
  }


  /*
  ==========================================================
   DIMENSIONS
  ==========================================================
  */

  const height = 5.2;

  const width =
    height * aspect;


  return (
    <group
      ref={group}
      position={[
        0,
        -0.75,
        0
      ]}
    >

      {/* =================================================
          DEPTH SHADOW
      ================================================= */}

      <mesh
        position={[
          0.06,
          -0.02,
          -0.08
        ]}
        scale={[
          1.015,
          1.015,
          1
        ]}
      >

        <planeGeometry
          args={[
            width,
            height
          ]}
        />

        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.18}
          color="#5f4fff"
          depthWrite={true}
        />

      </mesh>


      {/* =================================================
          MAIN AVATAR
      ================================================= */}

      <mesh
        position={[
          0,
          0,
          0
        ]}
        renderOrder={3}
      >

        <planeGeometry
          args={[
            width,
            height
          ]}
        />

        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />

      </mesh>


      {/* =================================================
          FRONT DEPTH HIGHLIGHT
      ================================================= */}

      <mesh
        position={[
          -0.025,
          0.01,
          0.04
        ]}
        scale={[
          1.002,
          1.002,
          1
        ]}
      >

        <planeGeometry
          args={[
            width,
            height
          ]}
        />

        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.12}
          color="#b7aaff"
          depthWrite={false}
          toneMapped={false}
        />

      </mesh>

    </group>
  );
}
