import fs from "fs/promises";
import path from "path";
import { URL } from "url";
import {
  LinkRepo,
  Loader,
  Medley,
  MedleyOptions,
  ModuleType,
  NodeRepo,
  TypeRepo,
} from "../../src/index";
import xml from "xml-formatter";
import "systemjs";
import winston from "winston";

const rootPath = path.resolve(__dirname + "/..");

describe("Medley", function () {
  it("should load and run basic composition without error", async function () {
    const logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({
              format: "YY-MM-DD HH:MM:SS",
            }),
            winston.format.printf((info:any) => {
              const { timestamp, level, message, typeName, nodeId } = info;
              return ` ${timestamp}  ${level} ${typeName} ${nodeId} : ${message}`;
            })
          ),
        }),
      ],
    });
    const options: MedleyOptions = {
      linkRepo: new LinkRepo(),
      typeRepo: new TypeRepo(
        new Loader(
          Loader.SystemImportWrapper((url:string) => {
            const module = System.import(url);
            return module;
          })
        )
      ),
      nodeRepo: new NodeRepo(),
      logger,
    };
    const medley = new Medley(options);

    const baseUrl = new URL(`file:///${rootPath}/fixtures/graphs/`);
    const graphJson = await fs.readFile(new URL("graph.json", baseUrl), {
      encoding: "utf-8",
    });
    const graph = JSON.parse(graphJson);
    medley.graph.setGraph(graph, baseUrl);

    const formatter = (xmlString: string) => {
      return xml(xmlString, { indentation: "  " });
    };

    medley.setScopeData({xmlFormatter: formatter});
    const res2 = await medley.runNodeWithInputs<string>(
      "nodeNested",
      {"typeNested-input-port": async ()=>"test input"},
      "testArg"
    );
    console.log(res2);
  });
  it("should return the active composition", async function () {
    const options: MedleyOptions = {
      linkRepo: new LinkRepo(),
      typeRepo: new TypeRepo(
        new Loader(
          Loader.SystemImportWrapper((url:string) => {
            const module = System.import(url);
            return module;
          })
        )
      ),
      nodeRepo: new NodeRepo(),
    };
    const medley = new Medley(options);

    const baseUrl = new URL(`file:///${rootPath}/fixtures/graphs/`);
    const graphJson = await fs.readFile(new URL("graph.json", baseUrl), {
      encoding: "utf-8",
    });
    const graph = JSON.parse(graphJson);
    await medley.graph.setGraph(graph, baseUrl);
  });
});
