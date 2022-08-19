import { BuilderState } from "../hooks/useBuilder";
import Menu from "./Menu";

const BuilderUI = (props: BuilderState) => {

  return <>
  <Menu {...props} />
  </>
}

export default BuilderUI;