import fs from "fs/promises";
import path from "path";
import { URL } from "url";
import { Medley, MedleyOptions, ModuleType } from "../../src/index";
import "systemjs";
import winston from "winston";

const rootPath = path.resolve(__dirname + "/..");

describe("Medley", function () {
  it("should load and run basic composition without error", async function () {
    const logger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
      ]
    });
    const options: MedleyOptions = {
      loader: {
        moduleType: ModuleType.SYSTEM,
        import: async (url) => {
          const module = await System.import(url);
          return module;
        },
      },
      logger
    };
    const medley = new Medley(options);

    const baseUrl = new URL(`file:///${rootPath}/fixtures/compositions/`);
    const compositionJson = await fs.readFile(
      new URL("composition.json", baseUrl),
      { encoding: "utf-8" }
    );
    const composition = JSON.parse(compositionJson);
    await medley.import(composition, baseUrl);
    const res = await medley.runNodeFunction<() => Promise<string>>(
      "e0754165-d127-48be-92c5-85fc25dbca19"
    );
    console.log(res);
//     expect(res).toEqual(`<moduleOne>
//   <moduleTwo-viewFunction childModelId="6d49b510-e790-42cf-a16e-01e4c152229e">
//     <moduleTwo-otherViewFunction childModelId="6d49b510-f790-42cf-a16e-01e4c152229b" context="custom value">
//       <moduleFour argument="moduleFour argument" context="custom value"></moduleFour>
//     </moduleTwo-otherViewFunction>
//   </moduleTwo-viewFunction>
//   <moduleThree argument="moduleThree argument" context="undefined"></moduleThree>
// </moduleOne>`);
   });
  // it("should return the active composition", async function () {
  //   const options: MedleyOptions = {
  //     loader: {
  //       moduleType: ModuleType.SYSTEM,
  //       import: async (url) => {
  //         const module = await System.import(url);
  //         return module;
  //       },
  //     },
  //   };    
  //   const medley = new Medley(options);

  //   const baseUrl = new URL(`file:///${rootPath}/fixtures/compositions/`);
  //   const compositionJson = await fs.readFile(
  //     new URL("composition.json", baseUrl),
  //     { encoding: "utf-8" }
  //   );
  //   const composition = JSON.parse(compositionJson);
  //   await medley.import(composition, baseUrl);
  // });
});
