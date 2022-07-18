import { ElementNodes } from "./elements";
import { Optional } from "./shared";

export type EnvironmentConfig = {
  fileUrl?: string;
};

export type SceneConfiguration = {
  elements?: Optional<ElementNodes>;
  environment?: Optional<EnvironmentConfig>;
};
