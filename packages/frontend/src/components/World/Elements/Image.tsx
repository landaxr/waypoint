import { ImageConfig } from "../../../types/elements";
import { Image as DreiImage } from "@react-three/drei";
import { useHttpsUrl } from "../../../api/ipfsUrls";
import { SceneFilesLocal } from "../../../types/shared";

const Image = ({
  config,
  fileUrl,
}: {
  config: ImageConfig;
  fileUrl: string;
}) => {
  return <DreiImage url={fileUrl} />;
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
