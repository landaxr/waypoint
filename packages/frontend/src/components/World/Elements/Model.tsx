import { ModelConfig } from "../../../types/elements";
import { useGLTF } from "@react-three/drei";
import { useHttpsUrl } from "../../../api/ipfsUrls";
import { SceneFilesLocal } from "../../../types/shared";

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
  files: SceneFilesLocal;
}) => {
  const fileUrl = useHttpsUrl(config.file, files);

  if (!fileUrl) return null;

  return <Model config={config} fileUrl={fileUrl} />;
};

export default ModelNullGuard;
