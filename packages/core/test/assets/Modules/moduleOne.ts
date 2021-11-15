import { NF, Port} from "@medley-js/core";

export const nodeFunction: NF = async ({ logger, input }, testArg: string) => {
  logger.info("log from ModuleOne.typeOne");
  const portOneValue = await input(portOne);
  const portTwoValue = await input(portTwo);

  const xml = `<moduleOne-typeOne>${portOneValue}${portTwoValue}</moduleOne-typeOne>`;

  return xml; 
};

const portOne: Port<string> = {
  name: "typeOnePortOne",
};

const portTwo: Port<string> = {
  name: "typeOnePortTwo",
};
