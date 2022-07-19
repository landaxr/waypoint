import { useState } from "react";
import {
  applyUpdates,
  createNewElement,
  updateEnvironment,
} from "../editorDb/mutations";
import { EnvironmentConfig, SceneConfiguration } from "../types/scene";
import { Element, ElementType } from "../types/elements";
import { FileLocationKind } from "../types/shared";
import Scene from "./Scene";
import useSceneUpdater from "./Builder/useSceneUpdater";

const randomEnvironment = (): EnvironmentConfig => {
  // todo: randomize
  return {
    environmentMap: {
      kind: FileLocationKind.https,
      url: "https://firebasestorage.googleapis.com/v0/b/mintxr-experiment.appspot.com/o/kloppenheim_02_1k.pic?alt=media&token=42249658-2916-496b-84ab-f66481b46668",
    },
  };
};

const marbleTheatorModel = (): Element => ({
  elementType: ElementType.Model,
  transform: {
    position: {
      y: -4,
    },
  },
  modelConfig: {
    file: {
      kind: FileLocationKind.https,
      url: "https://firebasestorage.googleapis.com/v0/b/mintxr-experiment.appspot.com/o/MarbleTheater-Metallic.glb?alt=media&token=137e6259-00c5-46e3-8a0b-fbe1398b98c1",
    },
  },
});

const makeNewScene = (): SceneConfiguration => {
  return applyUpdates({}, [
    updateEnvironment({ environment: randomEnvironment() }),
    // createNewElement({ elementConfig: marbleTheatorModel() }),
  ]);
};

const New = () => {
  const [scene, setScene] = useState<SceneConfiguration>(() => makeNewScene());

  const sceneUpdater = useSceneUpdater({
    scene,
  });

  return <Scene {...sceneUpdater} />;
};

export default New;
