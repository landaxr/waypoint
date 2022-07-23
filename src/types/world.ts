import { SceneConfiguration } from "./scene";
import { SceneFilesLocal, SceneFilesStored } from "./shared";

export type World<T extends SceneFilesLocal | SceneFilesStored> = {
  tokenId: string;
  ownerId: string;
  scene: SceneConfiguration;
  files: T;
};

export type WorldErc721 = {
  animation_url?: string;
  image?: string;
  name: string;
  scene_graph_url?: string;
};
