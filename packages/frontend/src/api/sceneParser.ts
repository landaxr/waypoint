import {
  Element,
  ElementNodes,
  ElementType,
  ImageElement,
  ModelElement,
} from "../types/elements";
import { SceneConfiguration } from "../types/scene";
import { FileLocation, FileLocationKind, Optional } from "../types/shared";

type Acc = {
  childrenWithPathsReplaced: ElementNodes;
  files: File[];
};
function replaceFileWithPath(fileLocation: FileLocation | undefined): {
  fileAsPath: FileLocation | undefined;
  file: File | undefined;
} {
  if (fileLocation?.kind === FileLocationKind.blob) {
    const { file } = fileLocation;

    const fileName = file.name;

    const fileAsPath: FileLocation = {
      kind: FileLocationKind.ipfsRelative,
      url: `/${fileName}`,
    };
    return {
      fileAsPath,
      file,
    };
  }

  return {
    fileAsPath: fileLocation,
    file: undefined,
  };
}

type UpdateResult<T extends Element> = {
  element: T;
  files: File[];
};
function elementUpdater<T extends Element>(
  element: T,
  updaters: {
    filePath: (element: T) => Optional<FileLocation> | undefined;
    updater: (element: T, updatedFileLocation: FileLocation | undefined) => T;
  }[]
): UpdateResult<T> {
  const result = updaters.reduce(
    (acc: UpdateResult<T>, updater): UpdateResult<T> => {
      const fileLocation = updater.filePath(acc.element);
      if (!fileLocation) return acc;

      const { file, fileAsPath } = replaceFileWithPath(fileLocation);
      const updatedElement = updater.updater(acc.element, fileAsPath);

      const files = file ? [...acc.files, file] : acc.files;

      return {
        element: updatedElement,
        files,
      };
    },
    {
      element: element,
      files: [],
    }
  );

  return result;
}

function extractFilesToUploadForElementAndSetPaths(
  element: Element
): UpdateResult<Element> {
  if (element.elementType === ElementType.Image) {
    return elementUpdater<ImageElement>(element, [
      {
        filePath: (element) => element.imageConfig.file,
        updater: (element, fileLocation) => ({
          ...element,
          imageConfig: {
            ...element.imageConfig,
            file: fileLocation,
          },
        }),
      },
    ]);
  }
  if (element.elementType === ElementType.Model) {
    return elementUpdater<ModelElement>(element, [
      {
        filePath: (element) => element.modelConfig.file,
        updater: (element, fileLocation) => ({
          ...element,
          modelConfig: {
            ...element.modelConfig,
            file: fileLocation,
          },
        }),
      },
    ]);
  }

  return {
    element,
    files: [],
  };
}

function extractFilesToUploadForChildrenAndSetPaths(
  elements?: Optional<ElementNodes>
): Acc {
  const { childrenWithPathsReplaced, files } = Object.entries(
    elements || {}
  ).reduce(
    (acc: Acc, [elementId, existingElement]) => {
      const { files: childElementFiles, childrenWithPathsReplaced } =
        // recursive call - dig into children and extract files and set their paths
        extractFilesToUploadForChildrenAndSetPaths(existingElement.children);

      const { element: updatedElement, files: elementFiles } =
        extractFilesToUploadForElementAndSetPaths(existingElement);

      const element = {
        ...updatedElement,
        children: childrenWithPathsReplaced,
      };

      return {
        ...element,
        childrenWithPathsReplaced: {
          ...acc.childrenWithPathsReplaced,
          [elementId]: element,
        },
        files: [...acc.files, ...elementFiles, ...childElementFiles],
      };
    },
    {
      childrenWithPathsReplaced: {},
      files: [],
    }
  );

  return {
    files,
    childrenWithPathsReplaced,
  };
}

export function extractFilesToUploadForSceneAndSetPaths(
  scene: SceneConfiguration
): {
  files: File[];
  sceneWithPathsForFiles: SceneConfiguration;
} {
  const { files, childrenWithPathsReplaced } =
    extractFilesToUploadForChildrenAndSetPaths(scene.elements);

  const sceneWithPathsForFiles: SceneConfiguration = {
    ...scene,
    elements: childrenWithPathsReplaced,
  };

  return {
    sceneWithPathsForFiles,
    files,
  };
}
