import { ElementNodes } from "./elements";
import {
  FileReference,
  SceneFilesLocal,
  SceneFilesStored,
  Optional,
} from "./shared";

export type EnvironmentConfig = {
  environmentMap?: FileReference;
};

export type SceneConfiguration = {
  elements?: Optional<ElementNodes>;
  environment?: Optional<EnvironmentConfig>;
};

export type SceneAndFiles = {
  scene: SceneConfiguration;
  files: SceneFilesLocal;
};

export type StoredSceneAndFiles = {
  previousVersion?: {
    cid?: string;
  };
  scene: SceneConfiguration;
  files: SceneFilesStored;
};
