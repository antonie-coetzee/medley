import fs from "fs/promises"
import path from "path"
import {URL} from "url"
import { Medley, MedleyOptions } from "../../src/index";
import "systemjs";

const rootPath = path.resolve(__dirname + "/..");

describe('Medley', function() {
    it('should load and run basic composition without error', async function() {
      const options:MedleyOptions = {
        systemJsImport:async (url)=>{
          const module = await System.import(url)
          return module;
        },
        loadJson:async (url)=>{
          const json = await fs.readFile(new URL(url), {encoding:"utf-8"});
          return JSON.parse(json);
        }
      };
      const medley = new Medley(options);
      await medley.loadFromUrl(new URL(`file:///${rootPath}/fixtures/compositions/composition.json`));
      const viewFunc = await medley.getViewFunction<()=>Promise<string>>("e0754165-d127-48be-92c5-85fc25dbca19");
      const res = await viewFunc();
      expect(res).toEqual(`<moduleOne>
  <moduleTwo-viewFunction>
    <moduleTwo-otherViewFunction>
      modelTwo value, custom context prop: custom value
    </moduleTwo-otherViewFunction>
  </moduleTwo-viewFunction>
  <moduleThree>
    customContextProp: undefined
  </moduleThree>
</moduleOne>`);
    });
    it('should return the active composition', async function() {
      const options:MedleyOptions = {
        loadJson:async (url)=>{
          const json = await fs.readFile(new URL(url), {encoding:"utf-8"});
          return JSON.parse(json);
        }
      };
      const medley = new Medley(options);
      await medley.loadFromUrl(new URL(`file:///${rootPath}/fixtures/compositions/composition.json`));
      const compo = await medley.compositionRepository.composition;
    });
});
