import { useFrame } from "@react-three/fiber";
import { MutableRefObject, useRef } from "react";
import { Mesh, Raycaster } from "three";

const debug = false;

const SetCursorAndRaycaster = ({
  raycasterRef,
}: {
  raycasterRef: MutableRefObject<Raycaster>;
}) => {
  const meshRef = useRef<Mesh | null>(null);

  useFrame(({ mouse, camera }) => {
    raycasterRef.current.setFromCamera(mouse, camera);

    if (meshRef.current) {
      meshRef.current.position
        .copy(raycasterRef.current.ray.origin)
        .add(raycasterRef.current.ray.direction);
    }
  });

  return (
    <>
      {debug && (
        <mesh ref={meshRef}>
          <boxBufferGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial />
        </mesh>
      )}
    </>
  );
};

export default SetCursorAndRaycaster;
