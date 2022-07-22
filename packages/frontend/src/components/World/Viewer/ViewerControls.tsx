import { PointerLockControls, FlyControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

const ViewerControls = () => {
  const { gl, camera } = useThree();

  const showPointerLockControls = true;

  useEffect(() => {
    console.log("enabled:", showPointerLockControls);

    if (!showPointerLockControls) {
      document.exitPointerLock();
    }
  }, [showPointerLockControls]);

  return (
    <>
      {showPointerLockControls && (
        <>
          <PointerLockControls args={[camera, gl.domElement]} />
          <FlyControls dragToLook />
        </>
      )}
    </>
  );
};

export default ViewerControls;
