import { PointerLockControls, FlyControls } from "@react-three/drei";
import { useEffect } from "react";
import { BuilderState } from "../Builder/useBuilder";
import TransformAndOrbitControls from "./TransformAndOrbitControls";

const Controls = ({
  isDragging,
  transforming,
  targetElement,
}: Pick<BuilderState, "isDragging" | "transforming" | "targetElement">) => {
  const enableTransform = transforming.isTransforming && !!targetElement;

  const showPointerLockControls = !isDragging && !enableTransform;

  useEffect(() => {
    console.log({
      enableTransform,
      targetElement: !!targetElement,
    });
  }, [enableTransform, targetElement]);

  return (
    <>
      {showPointerLockControls && (
        <>
          <PointerLockControls />
          <FlyControls />
        </>
      )}

      {enableTransform && targetElement && (
        <TransformAndOrbitControls targetElement={targetElement} />
      )}
    </>
  );
};

export default Controls;
