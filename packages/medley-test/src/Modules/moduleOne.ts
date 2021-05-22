import { ViewFunction } from "medley";

type config = {
  childModelId:string;
}

export const viewFunction:ViewFunction = async (ctx) => {
  const config = ctx.model.value as config;
  if(config){
    const res = await ctx.viewEngine.renderModel<string>(config.childModelId);
    return "<moduleOne> " + res;
  }
}
