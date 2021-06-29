import fs from "fs/promises";
import path from "path";
import { URL } from "url";
import { Medley, MedleyOptions } from "../../src/index";
import "systemjs";

const rootPath = path.resolve(__dirname + "/..");

describe("Medley", function () {
  it("should load and run basic composition without error", async function () {
    const options: MedleyOptions = {
      loader: {
        systemJsImport: async (url) => {
          const module = await System.import(url);
          return module;
        },
      },
    };
    const medley = new Medley(options);
    const baseUrl = new URL(`file:///${rootPath}/fixtures/compositions/`);
    const compositionJson = await fs.readFile(
      new URL("composition.json", baseUrl),
      { encoding: "utf-8" }
    );
    const composition = JSON.parse(compositionJson);
    await medley.load(composition, baseUrl);
    const viewFunc = await medley.getViewFunction<() => Promise<string>>(
      "e0754165-d127-48be-92c5-85fc25dbca19"
    );
    const res = await viewFunc();
    expect(res).toEqual(`<moduleOne>
  <moduleTwo-viewFunction>
    <moduleTwo-otherViewFunction>
      modelTwo value, custom context prop: custom value
    </moduleTwo-otherViewFunction>
  </moduleTwo-viewFunction>
  <moduleThree>
    arg01: module three argument
    customContextProp: undefined
  </moduleThree>
</moduleOne>`);
  });
  it("should return the active composition", async function () {
    const medley = new Medley({});

    const baseUrl = new URL(`file:///${rootPath}/fixtures/compositions/`);
    const compositionJson = await fs.readFile(
      new URL("composition.json", baseUrl),
      { encoding: "utf-8" }
    );
    const composition = JSON.parse(compositionJson);
    await medley.load(composition, baseUrl);
  });
});
