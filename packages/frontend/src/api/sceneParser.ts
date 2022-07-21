import { merge } from "lodash";
import {
  Element,
  ElementNodes,
  ElementType,
  ImageElement,
  ModelElement,
} from "../types/elements";
import { FilesByPath, SceneConfiguration } from "../types/scene";
import { FileLocation, FileLocationKind, Optional } from "../types/shared";

type Acc = {
  childrenWithPathsReplaced: ElementNodes;
  filesToUpload: FilesByPath;
};
function replaceFileWithPath(
  fileLocation: FileLocation | undefined,
  files: FilesByPath
): {
  fileAsPath: FileLocation | undefined;
  file: File | undefined;
} {
  // todo: fetch https files from clound and bundle into ipfs - or do we even need https based files?

  if (fileLocation?.kind === FileLocationKind.local) {
    return {
      fileAsPath: fileLocation,
      file: files[fileLocation.path],
    };
  }

  return {
    fileAsPath: fileLocation,
    file: undefined,
  };
}

type UpdateResult<T extends Element> = {
  element: T;
  files: FilesByPath;
};

type Updater<T extends Element> = {
    filePath: (element: T) => Optional<FileLocation> | undefined;
    updater: (updatedFileLocation: FileLocation | undefined) => Partial<T>;
  }
function elementUpdater<T extends Element>(
  element: T,
  files: FilesByPath,
  updaters: Updater<T>[]
): UpdateResult<T> {
  const result = updaters.reduce(
    (acc: UpdateResult<T>, updater): UpdateResult<T> => {
      const fileLocation = updater.filePath(acc.element);
      if (!fileLocation) return acc;

      const { file, fileAsPath } = replaceFileWithPath(fileLocation, files);
      const updatedElement = merge({}, acc.element, updater.updater(fileAsPath)) as T;

      const updatedFiles = file ? {...acc.files, [file.name]:file} : acc.files;

      return {
        element: updatedElement,
        files: updatedFiles,
      };
    },
    {
      element: element,
      files: {},
    }
  );

  return result;
}

function extractFilesToUploadForElementAndSetPaths(
  element: Element,
  files: FilesByPath
): UpdateResult<Element> {
if (element.elementType === ElementType.Image) {
    return elementUpdater(element, files, [
      {
        filePath: (element) => element.imageConfig.file,
        updater: (fileLocation) => ({
          imageConfig: {
            file: fileLocation,
          }
        }),
      },
    ]);
  } else if(element.elementType === ElementType.Model) {
    return elementUpdater(element, files, [
      {
        filePath: (element) => element.modelConfig.file,
        updater: (fileLocation) => ({
          modelConfig: {
            file: fileLocation,
          },
        }),
      },
    ]);
  }

  return {
    element,
    files: {},
  };
}

function extractFilesToUploadForChildrenAndSetPaths(
  elements: Optional<ElementNodes> | undefined,
  files: FilesByPath
): Acc {
  const { childrenWithPathsReplaced, filesToUpload } = Object.entries(
    elements || {}
  ).reduce(
    (acc: Acc, [elementId, existingElement]): Acc => {
      const { filesToUpload: childElementFiles, childrenWithPathsReplaced } =
        // recursive call - dig into children and extract files and set their paths
        extractFilesToUploadForChildrenAndSetPaths(existingElement.children, files);

      const { element: updatedElement, files: elementFiles } =
        extractFilesToUploadForElementAndSetPaths(existingElement, files);

      const element = {
        ...updatedElement,
        children: childrenWithPathsReplaced,
      };

      return {
        childrenWithPathsReplaced: {
          ...acc.childrenWithPathsReplaced,
          [elementId]: element,
        },
        filesToUpload: {
          ...acc.filesToUpload,
          ...elementFiles,
          ...childElementFiles,
        },
      };
    },
    {
      childrenWithPathsReplaced: {},
      filesToUpload: {},
    }
  );

  return {
    filesToUpload,
    childrenWithPathsReplaced,
  };
}

export function extractFilesToUploadForSceneAndSetPaths(
  scene: SceneConfiguration,
  files: FilesByPath
): {
  filesToUpload: File[];
  sceneWithPathsForFiles: SceneConfiguration;
} {
  const { filesToUpload, childrenWithPathsReplaced } =
    extractFilesToUploadForChildrenAndSetPaths(scene.elements, files);

  const sceneWithPathsForFiles: SceneConfiguration = {
    ...scene,
    elements: childrenWithPathsReplaced,
  };

  return {
    sceneWithPathsForFiles,
    filesToUpload: Object.values(filesToUpload),
  };
}
