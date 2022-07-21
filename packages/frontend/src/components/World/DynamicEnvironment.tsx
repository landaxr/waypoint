import { Environment } from "@react-three/drei";
import { useHttpsUrl } from "../../api/ipfsUrls";
import { SceneConfiguration } from "../../types/scene";
import { SceneFilesLocal } from "../../types/shared";

const DynamicEnvironment = ({
  environment,
  files,
}: Pick<SceneConfiguration, "environment"> & {
  files: SceneFilesLocal;
}) => {
  const fileUrl = useHttpsUrl(environment?.environmentMap, files);

  if (!fileUrl) return null;

  return <Environment files={fileUrl} background />;
};

export default DynamicEnvironment;
