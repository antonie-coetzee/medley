import { MultiPort, NF, UniPort } from "medley";

export const typeTwoNodeFunction: NF = async ({ input, logger }) => {
  logger.info("log from ModuleTwo.typeTwo");
  const portOneValue = await input<typeof typeTwoPortOne>({
    ...typeTwoPortOne,
    context: { customContextProp: "dfg" },
  });

  const testResult = await input(typeTwoPortMulti, "ssdf");
  return `<moduleTwo-typeTwo>${portOneValue}</moduleTwo-typeTwo>`;
};

const typeTwoPortOne: UniPort<string> = {
  name: "typeTwoPortOne",
};

const typeTwoPortMulti: MultiPort<boolean> = {
  multiArity: true,
  name: "typeTwoPortMulti",
};

export const typeFiveNodeFunction: NF = async ({ logger, input }) => {
  logger.info("log from ModuleTwo.typeFive");
  const portOneValue = await input(typeFivePortOne, "sdf");
  return `<moduleTwo-typeFive>${portOneValue}</moduleTwo-typeFive>`;
};

const typeFivePortOne: UniPort<string> = {
  name: "typeFivePortOne",
};

const typeFivePortTwo: UniPort<(arg1: string) => string> = {
  name: "typeFivePortTwo"
};
