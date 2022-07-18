import { SceneConfiguration } from "../types/scene";
import { Element } from "../types/elements";

const ElementNode = ({ element }: { element: Element }) => {
  return null;
};

const ElementsTree = ({ elements }: Pick<SceneConfiguration, "elements">) => {
  if (!elements) return null;
  return (
    <>
      {Object.entries(elements).map(([id, element]) => (
        <>
          <ElementNode element={element} key={id} />
        </>
      ))}
    </>
  );
};

export default ElementsTree;
