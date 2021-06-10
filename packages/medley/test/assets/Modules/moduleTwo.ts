import { Context } from "medley";

type config = {
  childModelId:string;
}

export async function viewFunction(this:Context){
  const config = this.getModelValue<config>();
  if(config){
    const res = await this.viewEngine.renderModel(config.childModelId);
    return "<moduleTwo viewFunction> " + res;
  }
}

export async function otherViewFunction(this:Context){
  return "<moduleTwo otherViewFunction> value: " + this.model.value;
}
