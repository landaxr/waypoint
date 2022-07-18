import { SceneConfiguration } from "../types/scene";
import { Element, ElementType } from "../types/elements";
import Model from "./Elements/Model";

const ElementNode = ({ element }: { element: Element }) => {
  return (
    <>
      {element.elementType === ElementType.Model && (
        <Model config={element.modelConfig} />
      )}

      {element.children && <ElementsTree elements={element.children} />}
    </>
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
