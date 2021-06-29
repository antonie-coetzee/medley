import { Context } from "medley";

type config = {
  childModelId:string;
}

type extendedContext = Context & {
  customContextProp:string;
}

export async function viewFunction(this:Context){
  const config = this.medley.getModelValue<config>();
  if(config){
    const res = await this.medley.runViewFunction<()=>Promise<string>>(config.childModelId);
    return `<moduleTwo-viewFunction>
    ${res}
  </moduleTwo-viewFunction>`
  }
}

export async function otherViewFunction(this:extendedContext){
  return `<moduleTwo-otherViewFunction>
      ${this.medley.model.value + ", custom context prop: " + this.customContextProp}
    </moduleTwo-otherViewFunction>`
}
