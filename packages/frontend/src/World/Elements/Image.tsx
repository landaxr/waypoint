import { ImageConfig } from "../../types/elements";
import { Image as DreiImage} from '@react-three/drei'
import { useHttpsUrl } from "../../lib/ipfs";

const Image = ({config, fileUrl}: { config: ImageConfig, fileUrl: string; }) => {
  return <DreiImage url={fileUrl} />
};

const ImageNullGuard  = ({config}: { config: ImageConfig }) => {
  const fileUrl = useHttpsUrl(config.file);

  if (!fileUrl) return null;

  return <Image config={config} fileUrl={fileUrl} />;
}

export default ImageNullGuard;
