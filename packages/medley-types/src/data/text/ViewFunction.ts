import { Context } from "medley";

const portOne: { name: string; shape?: () => Promise<string> } = {
  name: "typeOnePortOne",
};

const portTwo: { name: string; shape?: (arg01: String) => Promise<string> } = {
  name: "typeOnePortTwo",
};

export default async function (this: Context & { customContextProp: string }) {
  this.logger.info("log from ModuleOne.typeOne");
  this.customContextProp = "type one context value";
  const portOneValue = await this.port.single(portOne);
  const portTwoValue = await this.port.single(
    portTwo,
    "arg from typeOne into port two"
  );
  return `<moduleOne-typeOne>${portOneValue}${portTwoValue}</moduleOne-typeOne>`;
}
