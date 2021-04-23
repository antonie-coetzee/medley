export class Loader {
  private static loadJSON: ((path: URL) => Promise<any>) | null = null;

  constructor() {}

  private async init() {
    if (typeof window === "undefined" && typeof process === "object") {
      // running in node
      const { readFile } = await import("fs/promises");
      const nodeURL = (await import("url")).URL;
      Loader.loadJSON = async (url) => {
        const urlPath = new nodeURL(url.toString());
        const json = await readFile(urlPath, { encoding: "utf8" });
        return { default: JSON.parse(json) };
      };
    }else{
      // running in browser
      Loader.loadJSON = async (url) => {
        const json = await fetch(url.toString()).then(resp=>resp.json());
        return { default: JSON.parse(json) };
      };
    }
  }

  public async import(urlParam: URL): Promise<any> {
    const url = urlParam;
    if (Loader.loadJSON === null) {
      await this.init();
    }

    if (url.pathname.includes(".json") && Loader.loadJSON) {
      return Loader.loadJSON(url);
    }
    return import(url.toString());
  }
}
