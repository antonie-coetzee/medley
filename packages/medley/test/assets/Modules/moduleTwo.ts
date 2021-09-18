import { NF, PortSingle } from "medley";

export const typeTwoNodeFunction: NF = async ({ input, logger }) => {
  logger.info("log from ModuleTwo.typeTwo");
  const portOneValue = await input<typeof typeTwoPortOne>({
    ...typeTwoPortOne,
    context: { customContextProp: "dfg" },
  });
  return `<moduleTwo-typeTwo>${portOneValue}</moduleTwo-typeTwo>`;
};

const typeTwoPortOne: PortSingle<string> = {
  name: "typeTwoPortOne",
};

export const typeFiveNodeFunction: NF = async ({ logger, input }) => {
  logger.info("log from ModuleTwo.typeFive");
  const portOneValue = await input(typeFivePortOne, "sdf");
  return `<moduleTwo-typeFive>${portOneValue}</moduleTwo-typeFive>`;
};

const typeFivePortOne: PortSingle<string> = {
  name: "typeFivePortOne",
};

const typeFivePortTwo: PortSingle<(arg1: string) => string> = {
  name: "typeFivePortTwo"
};
