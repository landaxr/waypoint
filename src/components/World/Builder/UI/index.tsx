import { BuilderState } from "../hooks/useBuilder";
import ContentTree from "./ContentTree";
import Menu from "./Menu";

const BuilderUI = (props: BuilderState) => {
  return (
    <>
      <Menu {...props} />
      <ContentTree {...props} />
    </>
  );
};

export default BuilderUI;
