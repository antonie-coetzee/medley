import { Context } from "medley";

type extendedContext = Context & {
  customContextProp:string;
}

export async function viewFunction(this:extendedContext){
  return " <moduleThree> customContextProp: " + this.customContextProp;
}
