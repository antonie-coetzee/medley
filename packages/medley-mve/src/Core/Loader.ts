export class Loader {

  private static loadJSON:((path:URL)=>Promise<any>) | null = null

  constructor() {}

  private async init() {
    if(Loader.loadJSON !== null)
      return;

    if (typeof window === 'undefined' && typeof process === 'object'){
      // running in node
      const {readFile} = await import("fs/promises");
      const nativeURL = await (await import("url")).URL;
      Loader.loadJSON = async (url) => {
        const urlPath = new nativeURL(url.toString());
        const json = await readFile(urlPath, {encoding:"utf8"});
        return Promise.resolve({default: JSON.parse(json)});
      }
    }
  }

  public async import(urlParam: URL): Promise<any> {
    const url = urlParam;
    if(Loader.loadJSON === null){
      await this.init();
    }

    if(url.pathname.includes(".json") && Loader.loadJSON){
      return Loader.loadJSON(url);
    }
    return await import(url.toString());
  }
}
