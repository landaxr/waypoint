import { SceneConfiguration } from "../../../types/scene";
import { Element, ElementType, Transform } from "../../../types/elements";
import Model from "./Model";
import Image from "./Image";
import { useEffect, useMemo, useState } from "react";
import Video from "./Video";
import { SceneFilesLocal } from "../../../types/shared";
import { BuilderState } from "../Builder/hooks/useBuilder";
import { Object3D } from "three";

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
  selectedElementId,
  selectTargetElement,
}: {
  transform?: Transform | null;
  id: string;
  children: JSX.Element | JSX.Element[];
  selectedElementId?: string | null;
  selectTargetElement?: (selected: Object3D[] | null | undefined) => void;
}) => {
  const { position, rotation, scale } = transform || emptyTransform;

  const [groupRef, setGroupRef] = useState<Object3D | null>(null);

  useEffect(() => {
    if (!groupRef || !selectTargetElement) return;

    if (id === selectedElementId) {
      selectTargetElement([groupRef]);
    }
  }, [selectTargetElement, id, selectedElementId, groupRef]);

  return (
    <group
      ref={setGroupRef}
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
  builderState,
}: {
  id: string;
  element: Element;
  parentPath: string[];
  files: SceneFilesLocal;
  builderState?: BuilderState;
}) => {
  return (
    <TransformedElement
      id={id}
      transform={element.transform}
      selectedElementId={builderState?.selectedElement}
      selectTargetElement={builderState?.selectTargetElement}
    >
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
  files,
  builderState,
}: Pick<SceneConfiguration, "elements"> & {
  parentId: string | null;
  parentPath: string[];
  files: SceneFilesLocal;
  builderState?: BuilderState;
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
          builderState={builderState}
        />
      ))}
    </>
  );
};

export default ElementsTree;
