import fs from "fs/promises";
import path from "path";
import { URL } from "url";
import { MedleyTypes, Medley, MedleyOptions} from "../../dist/medley.cjs";
import "systemjs";

const rootPath = path.resolve(__dirname + "/..");

describe("Medley", function () {
  it("should load and run basic composition without error", async function () {
    const baseUrl = new URL(`file:///${rootPath}/fixtures/graphs/`);

    type testTypes = MedleyTypes & {
      type: {
        module: {
          base: string,
          system: string,
          exportMap?: {
            [key:string]:string;
          }    
        }
      }
    }

    const setup: MedleyOptions<testTypes> = {
      loader: {
        import: async (type, name) => {
          const resolvedModuleBaseUrl = new URL(type.module.base, baseUrl);
          const resolvedUrl = new URL(type.module.system, resolvedModuleBaseUrl);       
          const mod =  await System.import(resolvedUrl.toString());
          return mod[type.module.exportMap?.[name] || name];
        }       
      }
    };
    
    const medley = new Medley(setup);

    const graphJson = await fs.readFile(new URL("graph.json", baseUrl), {
      encoding: "utf-8",
    });
    const graph = JSON.parse(graphJson);
    medley.setGraph(graph);

    const res2 = await medley.composer.runNode<string>("nodeOne");
    console.log(res2);
  });
});
