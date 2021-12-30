import { NF, Port } from "@medley-js/core";

export const typeTwoNodeFunction: NF = async ({ input}) => {
  const portOneValue = await input(typeTwoPortOne);
  return `<moduleTwo-typeTwo>${portOneValue}</moduleTwo-typeTwo>`;
};

const typeTwoPortOne: Port<string> = {
  name: "typeTwoPortOne",
};

export const typeFiveNodeFunction: NF = async ({ input }) => {
  const portOneValue = await input(typeFivePortOne);
  return `<moduleTwo-typeFive>${portOneValue}</moduleTwo-typeFive>`;
};

const typeFivePortOne: Port<string> = {
  name: "typeFivePortOne",
};

