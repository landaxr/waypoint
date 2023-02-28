import { Object3D } from "three";
import { TransformControls, OrbitControls } from "@react-three/drei";
import { TransformMode } from "../Builder/hooks/useBuilder";

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
        onMouseUp={handleTransformComplete} matrixWorldAutoUpdate={undefined} getObjectsByProperty={undefined}      />
    </>
  );
};

export default TransformAndOrbitControls;
