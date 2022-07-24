import { PointerLockControls, FlyControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import TurnWithKeysControls from "../Controls/TurnWithKeysControls";

const ViewerControls = () => {
  const { gl, camera } = useThree();

  const showPointerLockControls = true;

  useEffect(() => {
    if (!showPointerLockControls) {
      document.exitPointerLock();
    }
  }, [showPointerLockControls]);

  return (
    <>
      {showPointerLockControls && (
        <>
          <PointerLockControls args={[camera, gl.domElement]} />
          <TurnWithKeysControls />
          <FlyControls dragToLook />
        </>
      )}
    </>
  );
};

export default ViewerControls;
