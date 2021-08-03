import { Context } from "medley";

const portOne: { name: string; shape?: () => Promise<string> } = {
  name: "typeOnePortOne",
};

const portTwo: { name: string; shape?: (arg01: String) => Promise<string> } = {
  name: "typeOnePortTwo",
};

export default async function (this: Context & { 
  customContextProp: string,
  xmlFormatter?: (xmlString:string)=>string;
}) {
  this.medley.logger.info("log from ModuleOne.typeOne");
  this.customContextProp = "type one context value";
  const portOneValue = await this.medley.port.single(portOne);
  const portTwoValue = await this.medley.port.single(
    portTwo,
    "arg from typeOne into port two"
  );

  const xml = `<moduleOne-typeOne>${portOneValue}${portTwoValue}</moduleOne-typeOne>`;

  if(this.xmlFormatter){
    const formattedXml = this.xmlFormatter(xml);
    this.medley.logger.info(`\n${formattedXml}`);
    return formattedXml;
  }else{
    return xml
  }
}
