const { System } = require("systemjs");
const fs = require('fs').promises;

const systemJSPrototype = System.constructor.prototype;

// add json module support to nodejs, already supported in the browser
const fetch = systemJSPrototype.fetch;
systemJSPrototype.fetch = async function (url: string, options: any) {
  if (url.startsWith("file://") && url.endsWith(".json")) {
    try {
      const json = await fs.readFile(url.replace("file://", ""), "utf8");
      return {
        ok: true,
        status: 200,
        headers: {
          get: (headerName: string) => {
            if (headerName === "content-type") {
              return "application/javascript";
            } else {
              throw Error(
                `NodeJS fetch emulation doesn't support ${headerName} header`
              );
            }
          },
        },
        async text() {
          return 'System.register([],function(e){return{execute:function(){e("default",' + json + ')}}})'
        },
        async json() {
          return JSON.parse(json);
        },
      };
    } catch (e) {
      if (e.code === "ENOENT")
        return { status: 404, statusText: e.toString() };
      else return { status: 500, statusText: e.toString() };
    }
  } else {
    return fetch(url, options);
  }
};

export class Loader {
  private context: any;

  constructor() {
    this.context = this.newContext();
  }

  private newContext(): any {
    const context = new System.constructor();
    return context;
  }

  public reset() {
    this.context = this.newContext();
  }

  public async import(url: string): Promise<any> {
    return await this.context.import(url);
  }
}
