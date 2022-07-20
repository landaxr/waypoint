import {
  Element,
  ElementNodes,
  ElementType,
  ImageElement,
} from "../types/elements";
import { SceneConfiguration } from "../types/scene";
import { FileLocation, FileLocationKind, Optional } from "../types/shared";

type Acc = {
  childrenWithPathsReplaced: ElementNodes;
  files: File[];
};
function replaceFileWithPath(fileLocation: FileLocation | undefined) {
  if (fileLocation?.kind === FileLocationKind.blob) {
    const { file } = fileLocation;

    const fileName = file.name;

    const fileAsPath: FileLocation = {
      kind: FileLocationKind.ipfs,
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

const filterUndefinedFiles = (files: (File | undefined)[]) =>
  files.filter((x) => typeof x !== "undefined") as File[];

function extractFilesToUploadForElementAndSetPaths(element: Element) {
  if (element.elementType === ElementType.Image) {
    const imageFile = element.imageConfig.file;
    const { fileAsPath: imageFileAsPath, file: imageFileBlob } =
      replaceFileWithPath(imageFile);
    const result: ImageElement = {
      ...element,
      imageConfig: {
        file: imageFileAsPath,
      },
    };
    return {
      element: result,
      files: filterUndefinedFiles([imageFileBlob]),
    };
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
