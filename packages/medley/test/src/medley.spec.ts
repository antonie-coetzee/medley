import fs from "fs/promises";
import path from "path";
import { URL } from "url";
import { Medley, MedleyOptions, ModuleType } from "../../src/index";
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
            winston.format.printf((info) => {
              const { timestamp, level, message, typeName, nodeId } = info;
              return ` ${timestamp}  ${level} ${typeName} ${nodeId} : ${message}`;
            })
          ),
        }),
      ],
    });
    const options: MedleyOptions = {
      loader: {
        moduleType: ModuleType.SYSTEM,
        import: async (url) => {
          const module = await System.import(url);
          return module;
        },
      },
      logger,
    };
    const medley = new Medley(options);

    const baseUrl = new URL(`file:///${rootPath}/fixtures/graphs/`);
    const graphJson = await fs.readFile(
      new URL("graph.json", baseUrl),
      { encoding: "utf-8" }
    );
    const graph = JSON.parse(graphJson);
    await medley.import(graph, baseUrl);
    const res = await medley.runNodeFunction<() => Promise<string>>("nodeOne");
    const formattedRes = xml(res, { indentation: "  " });
    expect(formattedRes).toEqual(
      '<moduleOne-typeOne>\r\n  <moduleTwo-typeTwo>\r\n    <moduleTwo-typeFive>\r\n      <moduleFour-typeFour argument="arg from typeFive into port one" context="type two context value"></moduleFour-typeFour>\r\n    </moduleTwo-typeFive>\r\n  </moduleTwo-typeTwo>\r\n  <moduleThree-typeThree argument="arg from typeOne into port two" context="type one context value"></moduleThree-typeThree>\r\n</moduleOne-typeOne>'
    );
  });
  it("should return the active composition", async function () {
    const options: MedleyOptions = {
      loader: {
        moduleType: ModuleType.SYSTEM,
        import: async (url) => {
          const module = await System.import(url);
          return module;
        },
      },
    };
    const medley = new Medley(options);

    const baseUrl = new URL(`file:///${rootPath}/fixtures/graphs/`);
    const graphJson = await fs.readFile(
      new URL("graph.json", baseUrl),
      { encoding: "utf-8" }
    );
    const graph = JSON.parse(graphJson);
    await medley.import(graph, baseUrl);
  });
});
