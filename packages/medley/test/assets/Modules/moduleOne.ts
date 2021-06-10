import { Context } from "medley";

type config = {
  childModelId:string;
}

export async function viewFunction(this:Context){
  const config = this.getModelValue<config>();
  if(config == null){
    return;
  }

  try{
    await this.viewEngine.renderModel<string>(""); // test empty case
  }catch{}

  await this.viewEngine.renderModel<string>(config.childModelId); // test viewFunction cachings
  const res = await this.viewEngine.renderModel<string>(config.childModelId);
  return "<moduleOne> " + res;
}
