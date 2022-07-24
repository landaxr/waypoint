import { ImageConfig } from "../../../types/elements";
import {
  useHttpsUriForIpfs,
  useHttpsUrl,
} from "../../../api/ipfs/ipfsUrlUtils";
import { SceneFilesLocal } from "../../../types/shared";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useEffect, useState } from "react";
import ErrorBoundary from "../../Shared/ErrorBoundary";
import useWhyDidYouUpdate from "../../../utils/useWhyDidYouUpdate";

export const useImageTexture = ({ fileUrl }: { fileUrl: string }) => {
  const texture = useLoader(TextureLoader, fileUrl);
  const [dimensions, setDimensions] = useState<[number, number]>(() => [1, 1]);

  useEffect(() => {
    if (texture) {
      console.log("texture changed");
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

const ImageTextureLoader = ({
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

export const IpfsImageTextureLoader = ({
  fileUrl,
  setTexture,
}: {
  fileUrl: string | undefined;
  setTexture: (texture: TextureAndDimensions) => void;
}) => {
  const httpsUrl = useHttpsUriForIpfs(fileUrl);
  if (!httpsUrl) return null;

  // return null;
  return (
    <ErrorBoundary>
      <ImageTextureLoader fileUrl={httpsUrl} setTexture={setTexture} />
    </ErrorBoundary>
  );
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
