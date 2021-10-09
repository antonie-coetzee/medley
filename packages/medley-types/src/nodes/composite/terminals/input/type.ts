import { Input, Type } from "medley";








export const inputTypeFactory = (input:Input, name:string) => {
  
  return {  
    name: "$input",
    volatile: true,
    version: "1.0.0",
    module: { import: () => Promise.resolve(exports) }
  }
};
