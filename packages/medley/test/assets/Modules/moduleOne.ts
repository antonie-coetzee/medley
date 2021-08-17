import { Context, NodeFunction } from "medley";

const portOne: { name: string; shape?: () => Promise<string> } = {
  name: "typeOnePortOne",
};

const portTwo: { name: string; shape?: (arg01: String) => Promise<string> } = {
  name: "typeOnePortTwo",
};

export const nodeFunction: NodeFunction<{
  customContextProp: string;
  xmlFormatter?: (xmlString: string) => string;
}> = async function () {
  this.logger.info("log from ModuleOne.typeOne");
  this.customContextProp = "type one context value";
  const portOneValue = await this.port.single(portOne);
  const portOneValueMulti = await this.port.multiple(portOne);
  const portTwoValue = await this.port.single(
    portTwo,
    "arg from typeOne into port two"
  );

  const xml = `<moduleOne-typeOne>${portOneValue}${portTwoValue}</moduleOne-typeOne>`;

  if (this.xmlFormatter) {
    const formattedXml = this.xmlFormatter(xml);
    this.logger.info(`\n${formattedXml}`);
    return formattedXml;
  } else {
    return xml;
  }
};
