import { ElementNodes } from "./elements";
import { FileLocation, Optional } from "./shared";

export type EnvironmentConfig = {
  environmentMap?: FileLocation;
};

export type SceneConfiguration = {
  elements?: Optional<ElementNodes>;
  environment?: Optional<EnvironmentConfig>;
};
