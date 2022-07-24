import { flatten, pick } from "lodash";
import { Element, ElementType } from "../types/elements";
import {
  EnvironmentConfig,
  SceneAndFiles,
  SceneConfiguration,
} from "../types/scene";
import {
  FileLocationKindStored,
  SceneFilesLocal,
  FileLocationStored,
  FileLocationLocal,
  SceneFilesStored,
  FileLocationKindLocal,
} from "../types/shared";

export function filterUndefined<T>(ids: (T | undefined)[]): T[] {
  return ids.filter((x) => x !== null && typeof x !== "undefined") as T[];
}

function toStoredFileLocationWithFileToUpload(
  fileLocation: FileLocationLocal
): {
  location: FileLocationStored;
  fileToUpload: File | undefined;
} {
  if (fileLocation.kind === FileLocationKindLocal.https)
    return {
      location: {
        kind: FileLocationKindStored.https,
        url: fileLocation.url,
      },
      fileToUpload: undefined,
    };
  if (fileLocation.kind === FileLocationKindLocal.ipfs)
    return {
      location: {
        kind: FileLocationKindStored.ipfs,
        cid: fileLocation.cid,
        url: fileLocation.url,
      },
      fileToUpload: undefined,
    };

  // last case - assume its an uploaded file
  return {
    location: {
      kind: FileLocationKindStored.local,
      path: fileLocation.file.name,
    },
    fileToUpload: fileLocation.file,
  };
}

function getElementFileIds(element: Element): string[] {
  if (element.elementType === ElementType.Image) {
    return filterUndefined([element.imageConfig.file?.fileId]);
  }
  if (element.elementType === ElementType.Model) {
    return filterUndefined([element.modelConfig.file?.fileId]);
  }
  if (element.elementType === ElementType.Video) {
    return filterUndefined([element.videoConfig.file?.original?.fileId]);
  }
  return [];
}

function getElementAndChildrenFileIds(element: Element): string[] {
  const childFileIds = flatten(
    Object.values(element.children || {}).map((child) =>
      getElementAndChildrenFileIds(child)
    )
  );

  const elementFileIds = getElementFileIds(element);

  return [...flatten(childFileIds), ...flatten(elementFileIds)];
}

function getFileIdsInEnvironment(
  environment: EnvironmentConfig | undefined | null
) {
  return filterUndefined([environment?.environmentMap?.fileId]);
}

type FilesToUploadAndUpdatedFileConfig = {
  sceneFiles: SceneFilesStored;
  toUpload: File[];
};

/**
 * Filters files from the global list of files for those that
 * exist in the scene graph or anywhere else in the scene.,
 * Converts filelocations stored as SceneFilesLocal to SceneFilesStored
 * @param scene
 * @param fileLocations
 * @returns
 */
function extractFilesToUploadAndConfigForChildren(
  scene: Pick<SceneConfiguration, "elements" | "environment">,
  fileLocations: SceneFilesLocal
): FilesToUploadAndUpdatedFileConfig {
  const fileIdsInScene = flatten(
    Object.values(scene.elements || {}).map((element) =>
      getElementAndChildrenFileIds(element)
    )
  );

  const fileIdsInEnvironment = getFileIdsInEnvironment(scene.environment);

  const fileIdsToUpload = [...fileIdsInScene, ...fileIdsInEnvironment];

  const fileLocationsToSave = pick(fileLocations, fileIdsToUpload);

  return Object.entries(fileLocationsToSave).reduce(
    (
      { sceneFiles, toUpload }: FilesToUploadAndUpdatedFileConfig,
      [id, fileLocation]
    ) => {
      const { fileToUpload, location } =
        toStoredFileLocationWithFileToUpload(fileLocation);

      return {
        sceneFiles: {
          ...sceneFiles,
          [id]: location,
        },
        toUpload: filterUndefined([...toUpload, fileToUpload]),
      };
    },
    {
      sceneFiles: {},
      toUpload: [],
    }
  );
}

/**
 * From scene and files, get the file assets to upload, as well as updated files config
 * @param param0
 * @returns
 */
export function extractFilesToUploadAndLocations({
  scene,
  files,
}: SceneAndFiles): FilesToUploadAndUpdatedFileConfig {
  return extractFilesToUploadAndConfigForChildren(scene, files);
}
