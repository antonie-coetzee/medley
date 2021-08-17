import { NF } from "medley";

type extendedContext = {
  customContextProp: string;
};

const nodeFunction: NF<extendedContext> = ({ customContextProp }) => {
  return `<moduleThree-typeThree context="${customContextProp}"></moduleThree-typeThree>`;
};

export default nodeFunction;
