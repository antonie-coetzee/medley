import { NF, Port} from "@medley-js/core";

export const nodeFunction: NF = async ({ input }, testArg: string) => {
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
