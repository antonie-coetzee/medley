import { URL } from "url";
import { Loader, Module, LoaderOptions, ModuleType } from "../../src/index";

describe("Loader", function () {
  it("should load a systemjs module without a baseUrl", async function () {
    const importFn = jest.fn((url: string) => Promise.resolve(true));
    const loaderOptions:LoaderOptions = {
      moduleType: ModuleType.SYSTEM,
      import: importFn,
    };    
    const loader = new Loader(loaderOptions);
    let module: Module = {
      system: "foo:/bar.js",
    };
    const res = await loader.importModule(module);
    expect(res).toEqual(true);
  });
  it("should load an esm module without a baseUrl", async function () {
    const importFn = jest.fn((url: string) => Promise.resolve(true));
    const loaderOptions:LoaderOptions = {
      moduleType: ModuleType.ESM,
      import: importFn,
    };   
    const loader = new Loader(loaderOptions);
    let module: Module = {
      esm: "foo:/bar.js",
    };
    const res = await loader.importModule(module);
    expect(res).toEqual(true);
  });
});
