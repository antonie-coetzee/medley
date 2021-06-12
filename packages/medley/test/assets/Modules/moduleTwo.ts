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
    const viewFunc = await this.medley.getViewFunction<()=>Promise<string>>(config.childModelId);
    const res = await viewFunc();
    return "<moduleTwo viewFunction> " + res;
  }
}

export async function otherViewFunction(this:extendedContext){
  return "<moduleTwo otherViewFunction> value: " + this.medley.model.value + ", custom context prop: " + this.customContextProp;
}
