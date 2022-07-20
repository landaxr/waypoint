import { SceneConfiguration } from "../types/scene";
import { extractFilesToUploadForSceneAndSetPaths } from "./sceneParser";

export const saveSceneToIpfs = async ({
  scene,
}: {
  scene: SceneConfiguration;
}) => {
  const { files, sceneWithPathsForFiles } =
    extractFilesToUploadForSceneAndSetPaths(scene);

  console.log({
    files,
    scene,
    sceneWithPathsForFiles,
  });
};
