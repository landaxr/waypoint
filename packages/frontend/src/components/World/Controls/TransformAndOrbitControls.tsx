import { Object3D } from "three";
import { TransformControls, OrbitControls } from "@react-three/drei";
import { TransformMode } from "../Builder/useBuilder";
import { useCallback } from "react";
import { Transform } from "../../../types/elements";

const TransformAndOrbitControls = ({
  targetElement,
  transformMode,
  handleTransformComplete,
}: {
  targetElement: Object3D;
  transformMode: TransformMode;
  handleTransformComplete: () => void;
}) => {
  return (
    <>
      <OrbitControls
        target0={targetElement.position || undefined}
        makeDefault
      />
      <TransformControls
        object={targetElement || undefined}
        mode={transformMode}
        onMouseUp={handleTransformComplete}
      />
    </>
  );
};

export default TransformAndOrbitControls;
