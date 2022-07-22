import randomString from "random-string";

export const newId = () => {
  return randomString({ length: 15 }).toLowerCase();
};
