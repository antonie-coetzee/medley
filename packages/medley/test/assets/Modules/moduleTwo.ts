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
    return `<moduleTwo-viewFunction childModelId="${config.childModelId}">
    ${res}
  </moduleTwo-viewFunction>`
  }
}

export async function otherViewFunction(this:extendedContext){
  const config = this.medley.getModelValue<config>();
  if(config){
    return `<moduleTwo-otherViewFunction childModelId="${config.childModelId}" context="${this.customContextProp}">
      ${await this.medley.runViewFunction<(arg01:string)=>Promise<string>>(config.childModelId, "moduleFour argument")}
    </moduleTwo-otherViewFunction>`
  }
}
