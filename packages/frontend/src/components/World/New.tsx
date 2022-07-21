import { useState } from "react";
import { applyUpdates, updateEnvironment } from "../../editorDb/mutations";
import {
  EnvironmentConfig,
  SceneAndFiles,
  SceneConfiguration,
} from "../../types/scene";
import { Element, ElementType } from "../../types/elements";
import { FileLocationKind } from "../../types/shared";
import SceneBuilder from "./Builder/SceneBuilder";
import { useBuilder } from "./Builder/useBuilder";

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

const makeNewScene = (): SceneAndFiles => ({
  scene: applyUpdates({}, [
    updateEnvironment({ environment: randomEnvironment() }),
    // createNewElement({ elementConfig: marbleTheatorModel() }),
  ]),
  files: {},
});

const New = () => {
  const [{ scene, files }] = useState<SceneAndFiles>(() => makeNewScene());

  const builderState = useBuilder({ scene, files });

  return (
    <SceneBuilder
      builderState={builderState}
      scene={builderState.scene}
      isNew
    />
  );
};

export default New;
