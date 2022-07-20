import { ModelConfig } from "../../../types/elements";
import { useGLTF } from "@react-three/drei";
import { useHttpsUrl } from "../../../api/ipfsUrls";

const Model = ({
  config,
  fileUrl,
}: {
  config: ModelConfig;
  fileUrl: string;
}) => {
  const model = useGLTF(fileUrl, true);

  return <primitive object={model.scene} />;
};

const ModelNullGuard = ({ config }: { config: ModelConfig }) => {
  const fileUrl = useHttpsUrl(config.file);

  if (!fileUrl) return null;

  return <Model config={config} fileUrl={fileUrl} />;
};

export default ModelNullGuard;
