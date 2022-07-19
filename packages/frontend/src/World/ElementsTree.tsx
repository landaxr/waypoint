import { SceneConfiguration } from "../types/scene";
import { Element, ElementType } from "../types/elements";
import Model from "./Elements/Model";
import Image from "./Elements/Image";
import { useEffect, useMemo, useState } from "react";
import { Object3D } from "three";
import { BuilderState } from "./Builder/useBuilder";

const pathsEqual = (a: string[], b: string[]) => {
  return a.join(",") === b.join(",");
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
  const transform = element.transform;
  const position = transform?.position;
  const scale = transform?.scale;
  const rotation = transform?.rotation;
  const [ref, setRef] = useState<Object3D | null>();

  useEffect(() => {
    if (!ref) return;

    if (
      !builderState.transforming.isTransforming ||
      !builderState.transforming.elementPath
    )
      return;

    const path = [...parentPath, id];

    if (pathsEqual(builderState.transforming.elementPath, path)) {
      builderState.selectTargetElement([ref]);
    }
  }, [
    builderState.transforming,
    builderState.selectTargetElement,
    parentPath,
    id,
    ref,
  ]);

  return (
    <group
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
    </group>
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
