import { NF, TypedPort } from "medley";

export const typeTwoNodeFunction: NF<{ customContextProp: string }> = async (cntx) => {
  const {
    logger,
    input,
  } = cntx;
  logger.info("log from ModuleTwo.typeTwo");
  cntx.customContextProp = "type two context value";
  const portOneValue = await input(typeTwoPortOne);
  return `<moduleTwo-typeTwo>${portOneValue}</moduleTwo-typeTwo>`;
};

const typeTwoPortOne: TypedPort<string> = {
  name: "typeTwoPortOne",
};

export const typeFiveNodeFunction:NF = async ({
  logger,
  input,
}) => {
  logger.info("log from ModuleTwo.typeFive");
  const portOneValue = await input(typeFivePortOne);
  return `<moduleTwo-typeFive>${portOneValue}</moduleTwo-typeFive>`;
}

const typeFivePortOne: TypedPort<string> = {
  name: "typeFivePortOne",
};

const typeFivePortTwo: TypedPort<string>= {
  name: "typeFivePortTwo",
};