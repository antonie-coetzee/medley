import { URL } from "url";
import { Loader, Module, LoaderOptions } from "../../src/index";

describe("Loader", function () {
  let loaderOptions: LoaderOptions | null = null;
  beforeEach(() => {
    const importFn = jest.fn((url: string) => Promise.resolve(true));
    loaderOptions = {
      esmImport: importFn,
      systemJsImport: importFn
    };
  });
  it("should load a systemjs module without a baseUrl", async function () {
    if (loaderOptions == null) throw new Error("loaderOptions null");
    const loader = new Loader(loaderOptions);
    let module: Module = {
      system: "foo:/bar.js",
    };
    const res = await loader.importModule(module);
    expect(res).toEqual(true);
  });
  it("should load an esm module without a baseUrl", async function () {
    if (loaderOptions == null) throw new Error("loaderOptions null");
    loaderOptions.systemJsImport = undefined;
    const loader = new Loader(loaderOptions);
    let module: Module = {
      esm: "foo:/bar.js",
    };
    const res = await loader.importModule(module);
    expect(res).toEqual(true);
  });
  it("should throw error if module loader missing", async function () {
    expect.assertions(1);
    if (loaderOptions == null) throw new Error("loaderOptions null");
    loaderOptions.systemJsImport = undefined;
    loaderOptions.esmImport = undefined;
    const loader = new Loader(loaderOptions);
    try {
      const res = await loader.importModule({
        esm: "foo:/bar.js",
      });
    } catch (e) {
      expect(e.message).toEqual("module loader not defined");
    }
  });
});
