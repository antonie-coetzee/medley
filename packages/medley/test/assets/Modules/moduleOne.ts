import { Context } from "medley";

interface ChildModuleViewFunction {
  ():Promise<string>;
}

type config = {
  childModelId:string;
}

export async function viewFunction(this:Context){
  const config = this.medley.getModelValue<config>();
  if(config == null){
    return;
  }

  const viewFunc = await this.medley.getViewFunction<ChildModuleViewFunction>(config.childModelId, {customContextProp:"custom value"});
  const res = await viewFunc();
  return "<moduleOne> " + res;
}
