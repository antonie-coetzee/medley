import { Context } from "medley";

export async function nodeFunction(this: Context){
  const boolValue = (this.node.value as boolean) || false;
  return boolValue;
}