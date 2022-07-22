import { PointerLockControls, FlyControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { BuilderState } from "./useBuilder";
import TransformAndOrbitControls from "../Controls/TransformAndOrbitControls";

const BuilderControls = ({
  isDragging,
  transforming,
  targetElement,
  transformMode,
  handleTransformComplete,
}: Pick<
  BuilderState,
  | "isDragging"
  | "transforming"
  | "targetElement"
  | "transformMode"
  | "handleTransformComplete"
>) => {
  const enableTransform = transforming.isTransforming && !!targetElement;

  const showPointerLockControls = !isDragging && !enableTransform;

  const { gl, camera } = useThree();

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

      {enableTransform && targetElement && transformMode && (
        <TransformAndOrbitControls
          targetElement={targetElement}
          transformMode={transformMode}
          handleTransformComplete={handleTransformComplete}
        />
      )}
    </>
  );
};

export default BuilderControls;
