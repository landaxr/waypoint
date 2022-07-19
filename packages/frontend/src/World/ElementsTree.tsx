import { SceneConfiguration } from "../types/scene";
import { Element, ElementType } from "../types/elements";
import Model from "./Elements/Model";
import Image from "./Elements/Image";

const ElementNode = ({ element }: { element: Element }) => {
  const transform = element.transform;
  const position = transform?.position;
  const scale = transform?.scale;
  const rotation = transform?.rotation;
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
    >
      {element.elementType === ElementType.Model && (
        <Model config={element.modelConfig} />
      )}
      {element.elementType === ElementType.Image && (
        <Image config={element.imageConfig} />
      )}

      {element.children && <ElementsTree elements={element.children} />}
    </group>
  );
};

const ElementsTree = ({ elements }: Pick<SceneConfiguration, "elements">) => {
  if (!elements) return null;
  return (
    <>
      {Object.entries(elements).map(([id, element]) => (
        <ElementNode element={element} key={id} />
      ))}
    </>
  );
};

export default ElementsTree;
