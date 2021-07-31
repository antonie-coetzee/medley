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

export async function typeTwoNodeFunction(
  this: Context & { customContextProp: string }
) {
  this.medley.logger.info("log from ModuleTwo.typeTwo");
  this.customContextProp = "type two context value";
  const portOneValue = await this.medley.portInput(typeTwoPortOne);
  return `<moduleTwo-typeTwo>${portOneValue}</moduleTwo-typeTwo>`;
}

export async function typeFiveNodeFunction(this: Context) {
  this.medley.logger.info("log from ModuleTwo.typeFive");
  const portOneValue = await this.medley.portInput(
    typeFivePortOne,
    "arg from typeFive into port one"
  );
  return `<moduleTwo-typeFive>${portOneValue}</moduleTwo-typeFive>`;
}
