import { SceneConfiguration } from "../../../types/scene";
import {
  Element,
  ElementType,
  IVector3,
  Transform,
} from "../../../types/elements";
import Model from "./Model";
import Image from "./Image";
import { useEffect, useMemo, useState } from "react";
import { Object3D, Vector3 } from "three";
import { BuilderState } from "../Builder/useBuilder";

const pathsEqual = (a: string[], b: string[]) => {
  return a.join(",") === b.join(",");
};

const emptyTransform: Transform = {};

export type isElementUserData = {
  isElement?: true;
};

export const isElementUserData: isElementUserData = {
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
  const [ref, setRef] = useState<Object3D | null>();

  const { position, rotation, scale } = transform || emptyTransform;

  return (
    <group
      userData={isElementUserData}
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
      ref={setRef}
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
          <Model config={element.modelConfig} />
        )}
        {element.elementType === ElementType.Image && (
          <Image config={element.imageConfig} />
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
