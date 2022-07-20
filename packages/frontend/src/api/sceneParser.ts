import { Element, ElementNodes } from "../types/elements";
import { SceneConfiguration } from "../types/scene";
import { Optional } from "../types/shared";

type Acc = {
  childrenWithPathsReplaced: ElementNodes;
  files: File[];
};

function extractFiledToUploadForChildrenAndSetPaths(
  elements?: Optional<ElementNodes>
): Acc {
  const { childrenWithPathsReplaced, files } = Object.entries(
    elements || {}
  ).reduce(
    (acc: Acc, [elementId, existingElement]) => {
      const { files: childElementFiles, childrenWithPathsReplaced } =
        // recursive call - dig into children and extract files and set their paths
        extractFiledToUploadForChildrenAndSetPaths(existingElement.children);

      const element = {
        ...existingElement,
        children: childrenWithPathsReplaced,
      };

      return {
        childrenWithPathsReplaced: {
          ...acc.childrenWithPathsReplaced,
          [elementId]: element,
        },
        files: [...acc.files, ...childElementFiles],
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

export function extractFilesToUploadForSceneAndSetPaths(scene: SceneConfiguration): {
  files: File[];
  sceneWithPathsForFiles: SceneConfiguration;
} {
  const { files, childrenWithPathsReplaced } = extractFiledToUploadForChildrenAndSetPaths(
    scene.elements
  );

  const sceneWithPathsForFiles: SceneConfiguration = {
    ...scene,
    elements: childrenWithPathsReplaced,
  };

  return {
    sceneWithPathsForFiles,
    files,
  };
}

