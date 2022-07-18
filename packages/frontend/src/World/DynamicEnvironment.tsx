import { Environment } from "@react-three/drei";
import { useHttpsUriForIpfs } from "../lib/ipfs";
import { SceneConfiguration } from "../types/scene";

const DynamicEnvironment = ({
  environment,
}: Pick<SceneConfiguration, "environment">) => {
  const fileUrl = useHttpsUriForIpfs(environment?.fileUrl);

  if (!fileUrl) return null;

  return <Environment files={fileUrl} background />;
};

export default DynamicEnvironment;
