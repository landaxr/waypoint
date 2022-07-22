import { SceneConfiguration } from "../../../types/scene";
import { Element, ElementType, Transform } from "../../../types/elements";
import Model from "./Model";
import Image from "./Image";
import { useMemo } from "react";
import { BuilderState } from "../Builder/useBuilder";
import Video from "./Video";

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
  builderState,
}: {
  id: string;
  element: Element;
  parentPath: string[];
  builderState: BuilderState;
}) => {
  return (
    <TransformedElement id={id} transform={element.transform}>
      <>
        {element.elementType === ElementType.Model && (
          <Model config={element.modelConfig} files={builderState.files} />
        )}
        {element.elementType === ElementType.Image && (
          <Image config={element.imageConfig} files={builderState.files} />
        )}
        {element.elementType === ElementType.Video && (
          <Video config={element.videoConfig} files={builderState.files} />
        )}

        {element.children && (
          <ElementsTree
            elements={element.children}
            parentId={id}
            parentPath={parentPath}
            builderState={builderState}
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
  builderState,
}: Pick<SceneConfiguration, "elements"> & {
  parentId: string | null;
  parentPath: string[];
  builderState: BuilderState;
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
          builderState={builderState}
        />
      ))}
    </>
  );
};

export default ElementsTree;
