import Url from "url-parse";
const fs = require("fs").promises;

declare global {
  interface Window {
    System: any;
  }
}

export class Loader {
  private context: any;

  private static systemJs: any;
  public static setSystemJs(systemjsConstructor: any) {
    if (Loader.systemJs) {
      return;
    }
    let jsonContentType = /^application\/json(;|$)/;
    const systemJSPrototype = systemjsConstructor.prototype;
    // add json module support to nodejs, already supported in the browser
    const fetch = systemJSPrototype.fetch;
    systemJSPrototype.fetch = async function (url: string, options: any) {
      if (url.startsWith("file:") && url.endsWith(".json")) {
        try {
          const json = await fs.readFile(new URL(url), "utf8");
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
              return (
                'System.register([],function(e){return{execute:function(){e("default",' +
                json +
                ")}}})"
              );
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
        return fetch(url, options).then(function (res: any) {
          if (!res.ok) return res;
          var contentType = res.headers.get("content-type");
          if (jsonContentType.test(contentType)) {
            return res.json().then(function (json: any) {
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
                  return (
                    'System.register([],function(e){return{execute:function(){e("default",' +
                    JSON.stringify(json) +
                    ")}}})"
                  );
                },
                async json() {
                  return JSON.parse(json);
                },
              };
            });
          } else {
            return res;
          }
        });
      }
    };
    Loader.systemJs = systemjsConstructor;
  }

  private static loadLibs() {
    let isNode = typeof exports === "object" ? true : false;
    if (isNode === true) {
      require('url');
      const { System } = require("systemjs"); // nodejs export
      Loader.setSystemJs(System.constructor);
    } else {
      require("systemjs/dist/system.js"); // global variable in browser
      Loader.setSystemJs(window.System.constructor);
    }
  }

  constructor() {
    if (Loader.systemJs === undefined) {
      Loader.loadLibs();
    }
    this.context = this.newContext();
  }

  private newContext(): any {
    const context = new Loader.systemJs();
    return context;
  }

  public reset() {
    this.context = this.newContext();
  }

  public async import(url: Url): Promise<any> {
    return await this.context.import(url.toString());
  }
}
