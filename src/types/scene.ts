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
  cid?: string;
};

export type StoredSceneAndFiles = {
  scene: SceneConfiguration;
  files: SceneFilesStored;
  forkedFrom?: string;
};
