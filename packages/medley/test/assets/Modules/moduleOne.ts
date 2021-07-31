import { Context } from "medley";

const PORT_ONE = "typeOnePortOne";
const PORT_TWO = "typeOnePortTwo";

interface TypeOnePortOneFunction {
  (): Promise<string>;
}

interface TypeOnePortTwoFunction {
  (arg01:String): Promise<string>;
}

export default async function (this: Context & {customContextProp:string}) {
  this.medley.logger.info("log from ModuleOne.typeOne");
  this.customContextProp = "custom value";
  const portOneValue = await this.medley.portInput<TypeOnePortOneFunction>(PORT_ONE);
  // const portTwoValue = await this.medley.portInput<TypeOnePortTwoFunction>(PORT_TWO, "arg from typeOne");

return `<moduleOne>
${portOneValue}
</moduleOne>`
}