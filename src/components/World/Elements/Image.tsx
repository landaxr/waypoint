import { ImageConfig } from "../../../types/elements";
import { useHttpsUriForIpfs, useHttpsUrl } from "../../../api/ipfs/ipfsUrls";
import { SceneFilesLocal } from "../../../types/shared";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useEffect, useState } from "react";

export const useImageTexture = ({ fileUrl }: { fileUrl: string }) => {
  const httpsUrl = useHttpsUriForIpfs(fileUrl) as string;
  const texture = useLoader(TextureLoader, httpsUrl);

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

  return {
    texture,
    dimensions,
  };
};

export type TextureAndDimensions = ReturnType<typeof useImageTexture>;

const ImageTextureLoaderInner = ({
  fileUrl,
  setTexture,
}: {
  fileUrl: string;
  setTexture: (texture: TextureAndDimensions) => void;
}) => {
  const textureAndDimensions = useImageTexture({ fileUrl });

  useEffect(() => {
    setTexture(textureAndDimensions);
  }, [textureAndDimensions, setTexture]);

  return null;
};

export const ImageTextureLoader = ({
  fileUrl,
  setTexture,
}: {
  fileUrl: string | undefined;
  setTexture: (texture: TextureAndDimensions) => void;
}) => {
  if (!fileUrl) return null;

  return <ImageTextureLoaderInner fileUrl={fileUrl} setTexture={setTexture} />;
};

const Image = ({
  config,
  fileUrl,
}: {
  config: ImageConfig;
  fileUrl: string;
}) => {
  const { texture, dimensions } = useImageTexture({ fileUrl });

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
