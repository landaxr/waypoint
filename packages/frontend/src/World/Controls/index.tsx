import { PointerLockControls, FlyControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { BuilderState, TransformMode } from "../Builder/useBuilder";
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

  useEffect(() => {
    console.log({
      enableTransform,
      targetElement: !!targetElement,
    });
  }, [enableTransform, targetElement]);

  const { gl } = useThree();

  return (
    <>
      {showPointerLockControls && (
        <>
          <PointerLockControls domElement={gl.domElement} />
          <FlyControls />
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
