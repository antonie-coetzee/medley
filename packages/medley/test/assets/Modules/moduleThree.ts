import { Context } from "medley";

type extendedContext = Context & {
  customContextProp: string;
};

export default async function (this: extendedContext, arg01: string) {
  return `<moduleThree-typeThree argument="${arg01}" context="${this.customContextProp}"></moduleThree-typeThree>`;
}
