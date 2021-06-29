import { Context } from "medley";

type extendedContext = Context & {
  customContextProp:string;
}

export async function viewFunction(this:extendedContext, arg01:string){
  return `<moduleThree>
    ${"arg01: " + arg01}
    ${"customContextProp: " + this.customContextProp}
  </moduleThree>`
}
