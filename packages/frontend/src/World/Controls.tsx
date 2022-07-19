import { PointerLockControls, FlyControls, useCursor } from "@react-three/drei";

const Controls = ({ isDragging }: { isDragging: boolean }) => {
  return (
    <>
      <PointerLockControls />
      <FlyControls />
    </>
  );
};

export default Controls;
