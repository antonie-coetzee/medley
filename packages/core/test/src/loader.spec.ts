import { Loader, Module } from "../../src/index";

describe("Loader", function () {
  it("should load a systemjs module without a baseUrl", async function () {
    const importFn = jest.fn((url: string) => Promise.resolve(true)); 
    const importer = Loader.SystemImportWrapper(async (url) => {
      const module = await importFn(url);
      return module;
    })
    const loader = new Loader(importer);
    let module: Module = {
      system: "foo:/bar.js",
    };
    const res = await loader.importModule(module, "");
    expect(res).toEqual(true);
  });
  it("should load an esm module without a baseUrl", async function () {
    const importFn = jest.fn((url: string) => Promise.resolve(true)); 
    const importer = Loader.ESMImportWrapper(async (url) => {
      const module = await importFn(url);
      return module;
    })
    const loader = new Loader(importer);
    let module: Module = {
      esm: "foo:/bar.js",
    };
    const res = await loader.importModule(module, "");
    expect(res).toEqual(true);
  });
});
