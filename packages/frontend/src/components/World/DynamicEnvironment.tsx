import { Environment } from "@react-three/drei";
import { useHttpsUrl } from "../../api/ipfsUrls";
import { SceneConfiguration } from "../../types/scene";

const DynamicEnvironment = ({
  environment,
}: Pick<SceneConfiguration, "environment">) => {
  const fileUrl = useHttpsUrl(environment?.environmentMap);

  if (!fileUrl) return null;

  return <Environment files={fileUrl} background />;
};

export default DynamicEnvironment;
