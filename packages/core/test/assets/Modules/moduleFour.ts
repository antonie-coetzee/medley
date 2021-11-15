import { NF } from "@medley-js/core";

type extendedContext = {
  customContextProp: string;
};

export const nodeFunction: NF = () => {
  return `<moduleFour-typeFour context=""></moduleFour-typeFour>`;
};
