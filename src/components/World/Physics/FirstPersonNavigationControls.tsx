import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, RigidBodyApi } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Mesh, Object3D, Vector3 } from "three";

const copyPositionAndLookAt = (from: Object3D, to: Object3D) => {
  from.getWorldPosition(to.position);
  from.getWorldQuaternion(to.quaternion);
};

const FirstPersonNavigationControls = ({
  movementSpeed = 10,
  jumpHeight = 100,
  turnSpeed = 0.05,
  timeBetweenJumps = 1000,
height = 2,
cameraHeight = 2
}: {
  movementSpeed?: number;
  jumpHeight?: number;
  turnSpeed?: number;
  timeBetweenJumps?: number;
height?: number;
cameraHeight?: number;
}) => {
  const eyesPositionRef = useRef<Group | null>(null);
  const movementDirectionRef = useRef<Group | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const rigidBodyRef = useRef<RigidBodyApi>(null);
  const cameraPositionRef = useRef<Group | null>(null);

  const { camera } = useThree();

  const [forwardPressed, setForwardPressed] = useState(false);
  const [backPressed, setBackPressed] = useState(false);
  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);
  const [turnRightPressed, setTurnRightPressed] = useState(false);
  const [turnLeftPressed, setTurnLeftPressed] = useState(false);

  const [jumpTriggered, setJumpTriggered] = useState(false);

  const toMoveFromRef = useRef(new Vector3());
  const impulseVectorRef = useRef(new Vector3());

  const movementVectors = useMemo(
    () => ({
      jump: new Vector3(0, jumpHeight, 0),
    }),
    [jumpHeight]
  );

  useEffect(() => {
    if (jumpTriggered) {
      if (rigidBodyRef.current)
        rigidBodyRef.current.applyImpulse(movementVectors.jump);

      setTimeout(() => {
        setJumpTriggered(false);
      }, timeBetweenJumps);
    }
  }, [jumpTriggered, movementVectors.jump, timeBetweenJumps]);

  useFrame(() => {
    const eyesPosition = eyesPositionRef.current;
    if (!eyesPosition) return;

    // copy position and lookat from camera position located in face of avatar
    if (cameraPositionRef.current)
      copyPositionAndLookAt(cameraPositionRef.current, camera);

    const rigidBody = rigidBodyRef.current;
    const targetObject = movementDirectionRef.current;
    const toMoveFrom = toMoveFromRef.current;
    const impulseVector = impulseVectorRef.current;

    if (rigidBody && eyesPosition && targetObject) {
      // get impulse direction vector
      eyesPosition.getWorldPosition(toMoveFrom);
      targetObject.getWorldPosition(impulseVector);
      impulseVector.sub(toMoveFrom);

      // apply impulse to person
      rigidBody.applyImpulse(impulseVector);
    }

    // turn if should
    if (meshRef.current) {
      if (turnLeftPressed) {
        meshRef.current.rotateY(turnSpeed);
      }
      if (turnRightPressed) {
        meshRef.current.rotateY(-turnSpeed);
      }
    }
  });

  useEffect(() => {
    const cb = (e: KeyboardEvent, keyDown: boolean) => {
      const keyPressed = e.key.toLowerCase();
      if (keyPressed === "w") setForwardPressed(keyDown);
      else if (keyPressed === "s") setBackPressed(keyDown);
      else if (keyPressed === "a") setLeftPressed(keyDown);
      else if (keyPressed === "d") setRightPressed(keyDown);
      else if (keyPressed === " ") {
        setJumpTriggered(true);
      } else if (keyPressed === "q") setTurnLeftPressed(keyDown);
      else if (keyPressed === "e") setTurnRightPressed(keyDown);
    };
    const down = (e: KeyboardEvent) => cb(e, true);
    const up = (e: KeyboardEvent) => cb(e, false);
    document.addEventListener("keydown", down);
    document.addEventListener("keyup", up);

    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("keyup", up);
    };
  }, [movementVectors.jump]);

  const zSpeed =
    +forwardPressed * -movementSpeed + +backPressed * movementSpeed;
  const xSpeed = +leftPressed * -movementSpeed + +rightPressed * movementSpeed;

  return (
    <RigidBody
      type="dynamic"
      colliders={"hull"}
      ref={rigidBodyRef}
      enabledRotations={[false, false, false]}
      friction={5}
      position={[0, 100, 0]}
    >
      <mesh ref={meshRef}>
        <boxBufferGeometry args={[1, height, 1]} />
        <meshLambertMaterial color="red" />
        <group ref={eyesPositionRef} position={[0, height/2 + cameraHeight/2, 0]}>
          <group
            ref={movementDirectionRef}
            position-x={xSpeed}
            position-z={zSpeed}
          />
          <group ref={cameraPositionRef} position={[0, 0, 3]} />
        </group>
      </mesh>
    </RigidBody>
  );
};

export default FirstPersonNavigationControls;
