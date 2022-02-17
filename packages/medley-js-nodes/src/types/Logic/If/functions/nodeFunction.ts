import { NF } from "@medley-js/core";
import { IfNode } from "../node";
import { falsePort, selectPort, truePort } from "../ports";

export const nodeFunction: NF<IfNode> = async (cntx) => {
  const selectValue = await cntx.input(selectPort);
  if(selectValue){
    return cntx.input(truePort);
  }else{
    return cntx.input(falsePort);
  }
};
