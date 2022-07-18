import { useState } from "react";
import { applyUpdates, updateEnvironment } from "../editorDb/mutations";
import { EnvironmentConfig, SceneConfiguration } from "../types/scene";
import Scene from "./Scene";

const randomEnvironment = (): EnvironmentConfig => {
  // todo: randomize
  return {
    fileUrl:
      "https://firebasestorage.googleapis.com/v0/b/mintxr-experiment.appspot.com/o/kloppenheim_02_1k.pic?alt=media&token=42249658-2916-496b-84ab-f66481b46668",
  };
};

const makeNewScene = (): SceneConfiguration => {
  const setEnvironment = updateEnvironment(randomEnvironment());

  return applyUpdates({}, [setEnvironment]);
};

const New = () => {
  const [scene, setScene] = useState<SceneConfiguration>(() => makeNewScene());

  return <Scene scene={scene} />;
};

export default New;
