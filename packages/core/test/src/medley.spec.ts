import fs from "fs/promises";
import path from "path";
import { URL } from "url";
import { Loader, Medley, MedleyOptions } from "../../src/index";
import "systemjs";

const rootPath = path.resolve(__dirname + "/..");

describe("Medley", function () {
  it("should load and run basic composition without error", async function () {
    const options: MedleyOptions = {
      loader: new Loader(
        Loader.SystemImportWrapper((url: string) => {
          return System.import(url);
        })
      )
    };
    const medley = new Medley(options);

    const baseUrl = new URL(`file:///${rootPath}/fixtures/graphs/`);
    const graphJson = await fs.readFile(new URL("graph.json", baseUrl), {
      encoding: "utf-8",
    });
    const graph = JSON.parse(graphJson);
    medley.graphs.setGraph(graph, baseUrl);

    const res2 = await medley.conductor.runNode<string>("nodeOne");
    console.log(res2);
  });
  it("should return the active composition", async function () {
    const options: MedleyOptions = {
      loader: new Loader(
        Loader.SystemImportWrapper((url: string) => {
          return System.import(url);
        })
      ),
    };
    const medley = new Medley(options);

    const baseUrl = new URL(`file:///${rootPath}/fixtures/graphs/`);
    const graphJson = await fs.readFile(new URL("graph.json", baseUrl), {
      encoding: "utf-8",
    });
    const graph = JSON.parse(graphJson);
    await medley.graphs.setGraph(graph, baseUrl);
  });
});
