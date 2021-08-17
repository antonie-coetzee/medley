import { NF, TypedPort } from "medley";

export const typeTwoNodeFunction: NF<{ customContextProp: string }> = async (cntx) => {
  const {
    logger,
    port,
  } = cntx;
  logger.info("log from ModuleTwo.typeTwo");
  cntx.customContextProp = "type two context value";
  const portOneValue = await port.input(typeTwoPortOne);
  return `<moduleTwo-typeTwo>${portOneValue}</moduleTwo-typeTwo>`;
};

typeTwoNodeFunction.ports = ()=>[typeTwoPortOne]

const typeTwoPortOne: TypedPort<string> = {
  name: "typeTwoPortOne",
};

export const typeFiveNodeFunction:NF = async ({
  logger,
  port,
}) => {
  logger.info("log from ModuleTwo.typeFive");
  const portOneValue = await port.input(typeFivePortOne);
  const portTwoValue = await port.input(typeFivePortTwo);
  return `<moduleTwo-typeFive>${portOneValue}</moduleTwo-typeFive>`;
}

typeFiveNodeFunction.ports = ()=>[typeFivePortOne,typeFivePortTwo]

const typeFivePortOne: TypedPort<string> = {
  name: "typeFivePortOne",
};

const typeFivePortTwo: TypedPort<string>= {
  name: "typeFivePortTwo",
};