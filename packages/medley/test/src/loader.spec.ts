import { URL } from "url";
import { Loader, Module, Platform } from "../../src/index";

describe("Loader", function () {
  let platform: Platform | null = null;
  beforeEach(() => {
    const importFn = jest.fn((url: string) => Promise.resolve(true));
    platform = {
      esmImport: importFn,
      systemJsImport: importFn,
      loadJson: importFn,
    };
  });
  it("should throw an error when json loader is not set", async function () {
    expect.assertions(1);
    if (platform == null) throw new Error("platform null");
    platform.loadJson = undefined;
    const loader = new Loader(platform);
    try {
      await loader.loadJson(new URL("foo:/bar.json"));
    } catch (e) {
      expect(e.message).toEqual("platform json loader not defined");
    }
  });
  it("should load a systemjs module without a baseUrl", async function () {
    if (platform == null) throw new Error("platform null");
    const loader = new Loader(platform);
    let module: Module = {
      systemUrl: "foo:/bar.js",
    };
    const res = await loader.importModule(module);
    expect(res).toEqual(true);
  });
  it("should load an esm module without a baseUrl", async function () {
    if (platform == null) throw new Error("platform null");
    platform.systemJsImport = undefined;
    const loader = new Loader(platform);
    let module: Module = {
      esmUrl: "foo:/bar.js",
    };
    const res = await loader.importModule(module);
    expect(res).toEqual(true);
  });
  it("should throw error if module loader missing", async function () {
    expect.assertions(1);
    if (platform == null) throw new Error("platform null");
    platform.systemJsImport = undefined;
    platform.esmImport = undefined;
    const loader = new Loader(platform);
    try {
      const res = await loader.importModule({
        esmUrl: "foo:/bar.js",
      });
    } catch (e) {
      expect(e.message).toEqual("platform module loader not defined");
    }
  });
});
