import { Context } from "medley";

type extendedContext = Context & {
  customContextProp:string;
}

export default async function nodeFunctionTypeTwo(this:extendedContext){
  // this.medley.logger.info("log from ModuleTwo.nodeFunctionTypeTwo");
  // const config = this.medley.getModelValue<config>();
  // if(config){
  //   const res = await this.medley.runViewFunction<()=>Promise<string>>(config.childModelId);
  //   return `<moduleTwo-viewFunction childModelId="${config.childModelId}">
  //   ${res}
  // </moduleTwo-viewFunction>`
  // }
  return `  <moduleTwo-typeTwo>
    ${this.customContextProp}
  </moduleTwo-typeTwo>`  
}

// export async function nodeFunctionTypeFive(this:extendedContext){
//   const config = this.medley.getModelValue<config>();
//   if(config){
//     return `<moduleTwo-otherViewFunction childModelId="${config.childModelId}" context="${this.customContextProp}">
//       ${await this.medley.runViewFunction<(arg01:string)=>Promise<string>>(config.childModelId, "moduleFour argument")}
//     </moduleTwo-otherViewFunction>`
//   }
// }
