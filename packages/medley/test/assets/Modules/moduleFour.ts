import { Context } from "medley";

type extendedContext = Context & {
  customContextProp: string;
};

export default async function (this: extendedContext, arg01: string) {
  return `<moduleFour-typeFour argument="${arg01}" context="${this.customContextProp}"></moduleFour-typeFour>`;
}
