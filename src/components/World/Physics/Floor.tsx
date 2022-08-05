import { Box } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

const Floor = () => {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <Box
        position={[0, -1, 0]}
        scale={[1000, 0.1, 1000]}
        rotation={[0, 0, 0]}
        receiveShadow
      >
        <meshBasicMaterial color="red" />
        {/* <shadowMaterial opacity={0.2} /> */}
      </Box>
    </RigidBody>
  );
};

export default Floor;
