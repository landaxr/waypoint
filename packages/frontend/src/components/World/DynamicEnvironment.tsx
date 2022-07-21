import { Environment } from "@react-three/drei";
import { useHttpsUrl } from "../../api/ipfsUrls";
import { FilesByPath, SceneConfiguration } from "../../types/scene";

const DynamicEnvironment = ({
  environment,
  files,
}: Pick<SceneConfiguration, "environment"> & {
  files: FilesByPath;
}) => {
  const fileUrl = useHttpsUrl(environment?.environmentMap, files);

  if (!fileUrl) return null;

  return <Environment files={fileUrl} background />;
};

export default DynamicEnvironment;
