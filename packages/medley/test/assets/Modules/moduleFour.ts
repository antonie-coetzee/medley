import { Context } from "medley";

type extendedContext = Context & {
  customContextProp:string;
}

export async function viewFunction(this:extendedContext, arg01:string){
  return `<moduleFour argument="${arg01}" context="${this.customContextProp}"></moduleFour>`
}
