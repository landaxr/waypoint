import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { Euler, Vector3 } from "three";

const changeEvent = { type: "change" };
const lockEvent = { type: "lock" };
const unlockEvent = { type: "unlock" };

const PI_2 = Math.PI / 2;

const PointerLockControls = ({
  minPolarAngle = 0,
  maxPolarAngle = Math.PI,
  enabled,
}: {
  minPolarAngle?: number;
  maxPolarAngle?: number;
  enabled?: boolean;
}) => {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  const [isLocked, setIsLocked] = useState(false);

  const euler = useRef(new Euler(0, 0, 0, "YXZ"));
  const vec = useRef<Vector3>();

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!domElement || !isLocked) return;

      const movementX =
        event.movementX ||
        (event as any).mozMovementX ||
        (event as any).webkitMovementX ||
        0;
      const movementY =
        event.movementY ||
        (event as any).mozMovementY ||
        (event as any).webkitMovementY ||
        0;

      const thisEueler = euler.current;
      thisEueler.setFromQuaternion(camera.quaternion);
      thisEueler.y -= movementX * 0.002;
      thisEueler.x -= movementY * 0.002;
      thisEueler.x = Math.max(
        PI_2 - maxPolarAngle,
        Math.min(PI_2 - minPolarAngle, thisEueler.x)
      );
      camera.quaternion.setFromEuler(thisEueler);
    },
    [camera, domElement, isLocked, minPolarAngle, maxPolarAngle]
  );

  const onPointerlockChange = useCallback((): void => {
    console.log('pointer lock changed');
    if (!domElement) return;
    if (domElement.ownerDocument.pointerLockElement === domElement) {
      lock();
      setIsLocked(true);
    } else {
      unlock();
      setIsLocked(false);
    }
  }, [domElement]);

  const onPointerlockError = useCallback((): void => {
    console.error("THREE.PointerLockControls: Unable to use Pointer Lock API");
  }, []);

  const connect = useCallback((): void => {
    console.log('connecting to', domElement);
    if (!domElement) return;
    domElement.ownerDocument.addEventListener("mousemove", onMouseMove);
    domElement.ownerDocument.addEventListener(
      "pointerlockchange",
      onPointerlockChange
    );
    domElement.ownerDocument.addEventListener(
      "pointerlockerror",
      onPointerlockError
    );
  }, [domElement, onMouseMove, onPointerlockChange, onPointerlockError]);

  const disconnect = useCallback((): void => {
    if (!domElement) return;
    domElement.ownerDocument.removeEventListener("mousemove", onMouseMove);
    domElement.ownerDocument.removeEventListener(
      "pointerlockchange",
      onPointerlockChange
    );
    domElement.ownerDocument.removeEventListener(
      "pointerlockerror",
      onPointerlockError
    );
  }, [domElement, onMouseMove, onPointerlockChange, onPointerlockError]);

  const lock = useCallback((): void => {
    if (!domElement) return
    domElement.requestPointerLock()
  }, [domElement]);

  const unlock = useCallback((): void => {
    if (!domElement) return
    domElement.ownerDocument.exitPointerLock()
  }, []);

  useEffect(() => {
    if (enabled) {
      console.log('connecting')
      connect();
      return () => {
        console.log('disconnecting');
        disconnect();
      };
    }
  }, [disconnect, connect, enabled]);

  return null;
};

export default PointerLockControls;
