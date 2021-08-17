import { NF } from "medley";

type extendedContext = {
  customContextProp: string;
};

const nodeFunction: NF<extendedContext> = ({ customContextProp }) => {
  return `<moduleFour-typeFour context="${customContextProp}"></moduleFour-typeFour>`;
};

export default nodeFunction;
