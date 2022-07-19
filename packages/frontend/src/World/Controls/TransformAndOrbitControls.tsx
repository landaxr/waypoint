import { Object3D } from "three";
import { TransformControls, OrbitControls } from "@react-three/drei";

const TransformAndOrbitControls = ({
  targetElement,
}: {
  targetElement: Object3D;
}) => {
  return (
    <>
      <OrbitControls
        target0={targetElement.position || undefined}
        makeDefault
      />
      <TransformControls object={targetElement || undefined} />
    </>
  );
};

export default TransformAndOrbitControls;
