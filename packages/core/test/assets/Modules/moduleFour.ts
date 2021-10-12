import { NF } from "@medley-js/core";

type extendedContext = {
  customContextProp: string;
};

export const nodeFunction: NF<extendedContext> = ({ customContextProp }) => {
  return `<moduleFour-typeFour context="${customContextProp}"></moduleFour-typeFour>`;
};
