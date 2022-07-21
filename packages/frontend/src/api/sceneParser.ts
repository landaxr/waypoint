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

function filterUndefined<T>(ids: (T | undefined)[]): T[] {
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

type Acc = {
  fileLocations: SceneFilesStored;
  toUpload: File[];
};

function extractFilesToUploadAndConfigForChildren(
  scene: SceneConfiguration,
  fileLocations: SceneFilesLocal
): Acc {
  const fileIdsInScene = flatten(
    Object.values(scene.elements || {}).map((element) =>
      getElementAndChildrenFileIds(element)
    )
  );

  const fileIdsInEnvironment = getFileIdsInEnvironment(scene.environment);

  const fileLocationsToSave = pick(fileLocations, [
    ...fileIdsInScene,
    ...fileIdsInEnvironment,
  ]);

  return Object.entries(fileLocationsToSave).reduce(
    ({ fileLocations, toUpload }: Acc, [id, fileLocation]) => {
      const { fileToUpload, location } =
        toStoredFileLocationWithFileToUpload(fileLocation);

      const updatedFiles = fileToUpload
        ? [...toUpload, fileToUpload]
        : toUpload;

      return {
        fileLocations: {
          ...fileLocations,
          [id]: location,
        },
        toUpload: updatedFiles,
      };
    },
    {
      fileLocations: {},
      toUpload: [],
    }
  );
}

export function extractFilesToUploadAndLocations({
  scene,
  files,
}: SceneAndFiles) {
  return extractFilesToUploadAndConfigForChildren(scene, files);
}
