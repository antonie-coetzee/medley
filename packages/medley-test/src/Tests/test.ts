import fs from "fs/promises"
import {URL} from "url"
import { Medley, MedleyOptions } from "medley";
import "systemjs";

describe('Medley', function() {
    it('should load and run basic composition', async function() {
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
      await medley.loadFromUrl(new URL("file:///C:/Dev/medley/packages/medley-test/dist/compositions/composition.json"));
      const result = await medley.renderModel("e0754165-d127-48be-92c5-85fc25dbca19");
      console.log(result);
    });
});
