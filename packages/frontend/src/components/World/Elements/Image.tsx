import { ImageConfig } from "../../../types/elements";
import { useHttpsUrl } from "../../../api/ipfsUrls";
import { SceneFilesLocal } from "../../../types/shared";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useEffect, useState } from "react";

const Image = ({
  config,
  fileUrl,
}: {
  config: ImageConfig;
  fileUrl: string;
}) => {
  const texture = useLoader(TextureLoader, fileUrl);

  const [dimensions, setDimensions] = useState<[number, number]>(() => [0, 1]);

  useEffect(() => {
    if (texture) {
      const { height, width } = texture.image as
        | HTMLImageElement
        | HTMLCanvasElement;
      const aspect = width / height;

      setDimensions([aspect, 1]);
    } else {
    }
  }, [texture]);

  if (!texture) return null;

  return (
    <mesh>
      <planeBufferGeometry args={dimensions} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const ImageNullGuard = ({
  config,
  files,
}: {
  config: ImageConfig;
  files: SceneFilesLocal;
}) => {
  const fileUrl = useHttpsUrl(config.file, files);

  if (!fileUrl) return null;

  return <Image config={config} fileUrl={fileUrl} />;
};

export default ImageNullGuard;
