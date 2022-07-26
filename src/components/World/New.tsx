import { useState } from "react";
import {
  addFile,
  applyUpdates,
  updateEnvironment,
} from "./Builder/hooks/mutations";
import { SceneAndFiles } from "../../types/scene";
import { FileLocationKindLocal, FileLocationLocal } from "../../types/shared";
import SceneBuilder from "./Builder/SceneBuilder";
import { ChainConfig } from "../../web3/chains";

const randomEnvironmentFile = (): { file: FileLocationLocal; id: string } => {
  // todo: randomize
  return {
    file: {
      kind: FileLocationKindLocal.https,
      url: "https://firebasestorage.googleapis.com/v0/b/mintxr-experiment.appspot.com/o/kloppenheim_02_1k.pic?alt=media&token=42249658-2916-496b-84ab-f66481b46668",
    },
    id: "kkloppenheim_02_1k.pic",
  };
};

export const makeNewScene = (): SceneAndFiles => {
  const { file, id: fileId } = randomEnvironmentFile();

  return {
    scene: applyUpdates({}, [
      updateEnvironment({
        environment: {
          environmentMap: {
            fileId: fileId,
          },
        },
      }),
      // createNewElement({ elementConfig: marbleTheatorModel() }),
    ]),
    files: addFile({ file, id: fileId })({}),
  };
};

const New = ({ chain }: { chain: ChainConfig }) => {
  const [sceneAndFiles] = useState<SceneAndFiles>(() => makeNewScene());

  return (
    <SceneBuilder
      sceneAndFiles={sceneAndFiles}
      isNew
      pageTitle="Building Draft World"
      portals={undefined}
      worldName={undefined}
      chain={chain}
    />
  );
};

export default New;
