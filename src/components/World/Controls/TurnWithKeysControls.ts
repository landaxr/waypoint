import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const TurnWithKeysControls = ({
  turnSpeed = 1000,
  movementSpeed = 0.002,
}: {
  turnSpeed?: number;
  movementSpeed?: number;
}) => {
  const { camera } = useThree();
  const turnLeft = useRef(false);
  const turnRight = useRef(false);

  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "q") {
        turnLeft.current = true;
      } else if (e.key.toLowerCase() === "e") {
        turnRight.current = true;
      }
    };
    const keyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "q") {
        turnLeft.current = false;
      } else if (e.key.toLowerCase() === "e") {
        turnRight.current = false;
      }
    };
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyDown);
    return () => {
      document.removeEventListener("keydown", keyDown);
      document.removeEventListener("keyup", keyUp);
    };
  }, []);

  useFrame((_, delta) => {
    let movementX = 0;

    if (turnLeft.current) {
      movementX = -delta * turnSpeed;
    }
    if (turnRight.current) {
      movementX = delta * turnSpeed;
    }

    if (movementX) {
      euler.current.setFromQuaternion(camera.quaternion);

      euler.current.y -= movementX * movementSpeed;

      camera.quaternion.setFromEuler(euler.current);
    }
  });

  return null;
};

export default TurnWithKeysControls;
