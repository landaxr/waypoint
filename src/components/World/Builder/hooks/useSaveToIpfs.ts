import { useCallback, useState, useEffect } from "react";
import { saveSceneToIpfs } from "../../../../api/ipfs/ipfsSceneSaver";
import { SceneConfiguration } from "../../../../types/scene";
import { SceneFilesLocal } from "../../../../types/shared";
import { SceneSaveStatus } from "./useBuilder";

const useSaveToIpfs = ({
  scene,
  files,
  updateCount,
  forkedFrom,
}: {
  scene: SceneConfiguration;
  files: SceneFilesLocal;
  updateCount: number;
  forkedFrom?: string;
}) => {
  const [hasChangesToSave, setHasChangesToSave] = useState(false);

  useEffect(() => {
    if (updateCount > 0) setHasChangesToSave(true);
  }, [setHasChangesToSave, updateCount]);

  const [saveSceneStatus, setSaveSceneStatus] = useState<SceneSaveStatus>({
    saving: false,
  });

  const handleSaveToIpfs = useCallback(async () => {
    if (saveSceneStatus.saving) return;
    setSaveSceneStatus({
      saving: true,
    });
    try {
      const { cid } = await saveSceneToIpfs({
        scene: scene,
        files: files,
        forkedFrom,
      });

      setSaveSceneStatus({
        savedCid: cid,
        saving: false,
        saved: true,
      });

      setHasChangesToSave(false);
    } catch (e) {
      console.error(e);

      setSaveSceneStatus({
        saving: false,
        error: e as Error,
      });
    }
  }, [saveSceneStatus.saving, scene, files, forkedFrom]);

  return {
    handleSaveToIpfs,
    hasChangesToSave,
    saveSceneStatus,
  };
};

export default useSaveToIpfs;
