import { ModelConfig } from "../../../types/elements";
import { useGLTF } from "@react-three/drei";
import { useHttpsUrl } from "../../../api/ipfsUrls";
import { FilesByPath } from "../../../types/scene";

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

const ModelNullGuard = ({
  config,
  files,
}: {
  config: ModelConfig;
  files: FilesByPath;
}) => {
  const fileUrl = useHttpsUrl(config.file, files);

  if (!fileUrl) return null;

  return <Model config={config} fileUrl={fileUrl} />;
};

export default ModelNullGuard;
