import fs from "fs/promises";
import path from "path";
import { URL } from "url";
import { MedleyTypes, Medley, MedleySetup} from "../../dist/medley.cjs";
import "systemjs";

const rootPath = path.resolve(__dirname + "/..");

describe("Medley", function () {
  it("should load and run basic composition without error", async function () {
    const baseUrl = new URL(`file:///${rootPath}/fixtures/graphs/`);

    type testTypes = MedleyTypes & {
      module: {
        base: string,
        system: string,
        exportMap?: {
          [key:string]:string;
        }
      }
    }

    const setup: MedleySetup<testTypes> = {
      loader: {
        import: async (module, name) => {
          const resolvedModuleBaseUrl = new URL(module.base, baseUrl);
          const resolvedUrl = new URL(module.system, resolvedModuleBaseUrl);       
          const mod =  await System.import(resolvedUrl.toString());
          return mod[module.exportMap?.[name] || name];
        }       
      }
    };
    
    const medley = new Medley(setup);

    const graphJson = await fs.readFile(new URL("graph.json", baseUrl), {
      encoding: "utf-8",
    });
    const graph = JSON.parse(graphJson);
    medley.setGraph(graph);

    const res2 = await medley.conductor.runNode<string>("nodeOne");
    console.log(res2);
  });
  it("should return the active composition", async function () {
    const baseUrl = new URL(`file:///${rootPath}/fixtures/graphs/`);
    
    type basetypes = {
      module: {
        import:()=>Promise<any>
      }
    }

    const options: MedleySetup<basetypes> = {
        // loader: new SystemLoader((url: string) => {
        //   return System.import(url);
        // }

      //)
      // loader: {
      //   import: (mod, name)=>{
      //     mod.import
      //     return null
      //   }
      // }
    };

    const medley = new Medley(options);

    
    const graphJson = await fs.readFile(new URL("graph.json", baseUrl), {
      encoding: "utf-8",
    });
    const graph = JSON.parse(graphJson);
    await medley.setGraph(graph);
  });
});
