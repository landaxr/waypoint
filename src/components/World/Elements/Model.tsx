import { ModelConfig } from "../../../types/elements";
import { useGLTF } from "@react-three/drei";
import { useHttpsUrl } from "../../../api/ipfs/ipfsUrlUtils";
import { SceneFilesLocal } from "../../../types/shared";
import ModelColliders from "../Physics/ModelColliders";

const Model = ({
  config,
  fileUrl,
}: {
  config: ModelConfig;
  fileUrl: string;
}) => {
  const model = useGLTF(fileUrl, true);

  return (
    <>
      <primitive object={model.scene} />
      <ModelColliders model={model} />
    </>
  );
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
