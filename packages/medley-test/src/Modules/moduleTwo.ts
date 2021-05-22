import { ViewFunction } from "medley";

type config = {
  childModelId:string;
}

export const viewFunction:ViewFunction = async (ctx) => {
  const config = ctx.model.value as config;
  if(config){
    const res = await ctx.viewEngine.renderModel(config.childModelId);
    return "<moduleTwo viewFunction> " + res;
  }
}

export const otherViewFunction:ViewFunction = async (ctx) => {
  return "<moduleTwo otherViewFunction> value: " + ctx.model.value;
}
