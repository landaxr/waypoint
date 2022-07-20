import { PointerLockControls, FlyControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { BuilderState } from "../Builder/useBuilder";
import TransformAndOrbitControls from "./TransformAndOrbitControls";

const Controls = ({
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

    console.log('enabled:', showPointerLockControls);

  }, [showPointerLockControls]);

  return (
    <>
      <PointerLockControls args={[camera, gl.domElement]} enabled={showPointerLockControls} />
      {showPointerLockControls && (
        <>
          <FlyControls dragToLook />
        </>
      )}

      {enableTransform && targetElement && (
        <TransformAndOrbitControls
          targetElement={targetElement}
          transformMode={transformMode}
          handleTransformComplete={handleTransformComplete}
        />
      )}
    </>
  );
};

export default Controls;
