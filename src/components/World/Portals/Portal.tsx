import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Object3D, DoubleSide } from "three";
import { Text } from "@react-three/drei";
import { PortalWithScene } from "./useSavePortalScenes";
import {
  IpfsImageTextureLoader,
  TextureAndDimensions,
} from "../Elements/Image";
import useWhyDidYouUpdate from "../../../utils/useWhyDidYouUpdate";

const teleportDistance = 1;

const portalScale = 1;

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

  const [textureAndDimensions, setTextureAndDimensions] =
    useState<TextureAndDimensions>();

  const [portalSize, setPortalSize] = useState<[number, number]>([
    portalScale,
    portalScale,
  ]);

  useEffect(() => {
    if (textureAndDimensions?.dimensions) {
      const portalAspect =
        textureAndDimensions.dimensions[0] / textureAndDimensions.dimensions[1];

      const portalSize: [number, number] = [
        portalAspect * portalScale,
        portalScale,
      ];
      console.log({ portalSize });
      setPortalSize(portalSize);
    }
  }, [textureAndDimensions?.dimensions]);

  useWhyDidYouUpdate("textur", {
    ...textureAndDimensions,
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
        <Text
          position-z={0.1}
          fontSize={0.15}
          outlineColor={"black"}
          outlineWidth={0.01}
        >
          Portal to {scene?.token.name}
        </Text>
        <mesh>
          <planeBufferGeometry args={portalSize} />
          {textureAndDimensions?.texture ? (
            <meshBasicMaterial
              key="texture"
              map={textureAndDimensions.texture}
              attach="material"
              side={DoubleSide}
            />
          ) : (
            <meshBasicMaterial
              key="backup"
              color="red"
              transparent
              opacity={0.7}
              attach="material"
            />
          )}
        </mesh>
      </group>
      <IpfsImageTextureLoader
        fileUrl={scene?.token.image}
        setTexture={setTextureAndDimensions}
      />
    </>
  );
};

export default Portal;
