import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Object3D } from "three";
import { Text } from "@react-three/drei";
import { PortalWithScene } from "./useSavePortalScenes";

const teleportDistance = 1;

const Portal = ({
  portal: { portal, scene },
  navigate,
  getWorldPath,
}: {
  portal: PortalWithScene;
  navigate: (to: string) => void;
  getWorldPath: (tokenId: string) => string;
}) => {
  const meshRef = useRef<Object3D | null>(null);

  const { camera } = useThree();

  useFrame(() => {
    if (!meshRef.current?.position) return;
    const distanceFromPortal = camera.position.distanceToSquared(
      meshRef.current.position
    );

    if (distanceFromPortal <= teleportDistance) {
      const worldPath = getWorldPath(portal.targetId);
      navigate(worldPath);
    }
  });

  return (
    <>
      <group
        position-x={portal.x}
        position-y={portal.y}
        position-z={portal.z}
        // @ts-ignore
        ref={meshRef}
      >
        <Text position-z={0.1}>Portal to World {portal.targetId}</Text>
        <mesh>
          <planeBufferGeometry args={[1, 2]} />
          <meshBasicMaterial color="red" transparent opacity={0.7} />
        </mesh>
      </group>
    </>
  );
};

const WorldPortals = ({
  portals,
  navigate,
  getWorldPath,
}: {
  portals: PortalWithScene[];
  navigate: (to: string) => void;
  getWorldPath: (tokenId: string) => string;
}) => {
  return (
    <>
      {portals.map((portal, i) => (
        <Portal
          portal={portal}
          key={portal.portal.id}
          navigate={navigate}
          getWorldPath={getWorldPath}
        />
      ))}
    </>
  );
};

export default WorldPortals;
