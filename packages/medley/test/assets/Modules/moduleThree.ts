import { NF } from "medley";

type extendedContext = {
  customContextProp: string;
};

export const nodeFunction: NF<extendedContext> = ({ customContextProp }) => {
  return `<moduleThree-typeThree context="${customContextProp}"></moduleThree-typeThree>`;
};
