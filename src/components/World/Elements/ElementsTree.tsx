import { SceneConfiguration } from "../../../types/scene";
import { Element, ElementType, Transform } from "../../../types/elements";
import Model from "./Model";
import Image from "./Image";
import { useMemo } from "react";
import Video from "./Video";
import { SceneFilesLocal } from "../../../types/shared";

const emptyTransform: Transform = {};

export type isElementUserData = {
  isElement?: true;
};

export const isElementUserDataIsTrue: isElementUserData = {
  isElement: true,
};

const TransformedElement = ({
  transform,
  id,
  children,
}: {
  transform?: Transform | null;
  id: string;
  children: JSX.Element | JSX.Element[];
}) => {
  const { position, rotation, scale } = transform || emptyTransform;

  return (
    <group
      userData={isElementUserDataIsTrue}
      name={id}
      position-x={position?.x}
      position-y={position?.y}
      position-z={position?.z}
      scale-x={scale?.x}
      scale-y={scale?.y}
      scale-z={scale?.z}
      rotation-x={rotation?.x}
      rotation-y={rotation?.y}
      rotation-z={rotation?.z}
    >
      {children}
    </group>
  );
};

const ElementNode = ({
  id,
  element,
  parentPath,
  files,
}: {
  id: string;
  element: Element;
  parentPath: string[];
  files: SceneFilesLocal;
}) => {
  return (
    <TransformedElement id={id} transform={element.transform}>
      <>
        {element.elementType === ElementType.Model && (
          <Model config={element.modelConfig} files={files} />
        )}
        {element.elementType === ElementType.Image && (
          <Image config={element.imageConfig} files={files} />
        )}
        {element.elementType === ElementType.Video && (
          <Video config={element.videoConfig} files={files} />
        )}

        {element.children && (
          <ElementsTree
            elements={element.children}
            parentId={id}
            parentPath={parentPath}
            files={files}
          />
        )}
      </>
    </TransformedElement>
  );
};

const ElementsTree = ({
  elements,
  parentId,
  parentPath,
  files,
}: Pick<SceneConfiguration, "elements"> & {
  parentId: string | null;
  parentPath: string[];
  files: SceneFilesLocal;
}) => {
  const path = useMemo(() => {
    if (parentId) return [...parentPath, parentId];

    return parentPath;
  }, [parentId, parentPath]);

  if (!elements) return null;
  return (
    <>
      {Object.entries(elements).map(([id, element]) => (
        <ElementNode
          id={id}
          element={element}
          key={id}
          parentPath={path}
          files={files}
        />
      ))}
    </>
  );
};

export default ElementsTree;
