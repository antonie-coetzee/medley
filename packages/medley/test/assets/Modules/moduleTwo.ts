import { Context } from "medley";

const typeTwoPortOne: { name: string; shape?: () => Promise<string> } = {
  name: "typeTwoPortOne",
};

const typeFivePortOne: {
  name: string;
  shape?: (arg01: String) => Promise<string>;
} = {
  name: "typeFivePortOne",
};

const typeFivePortTwo: {
  name: string;
  shape?: (arg01: String) => Promise<string>;
} = {
  name: "typeFivePortTwo",
};

export async function typeTwoNodeFunction(
  this: Context & { customContextProp: string }
) {
  this.logger.info("log from ModuleTwo.typeTwo");
  this.customContextProp = "type two context value";
  const portOneValue = await this.port.single(typeTwoPortOne);
  return `<moduleTwo-typeTwo>${portOneValue}</moduleTwo-typeTwo>`;
}

export async function typeFiveNodeFunction(this: Context) {
  this.logger.info("log from ModuleTwo.typeFive");
  const portOneValue = await this.port.single(
    typeFivePortOne,
    "arg from typeFive"
  );
  const portTwoValue = await this.port.single(
    typeFivePortTwo,
    "arg from typeFive"
  );  
  return `<moduleTwo-typeFive>${portOneValue}</moduleTwo-typeFive>`;
}
