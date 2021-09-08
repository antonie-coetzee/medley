import { NF, TypedPort } from "medley";

export const nodeFunction: NF<{
  customContextProp: string;
  xmlFormatter?: (xmlString: string) => string;
}> = async (cntx, testArg: string) => {
  const {
    logger,
    input,
    xmlFormatter
  } = cntx;
  logger.info("log from ModuleOne.typeOne");
  cntx.customContextProp = testArg;
  const portOneValue = await input(portOne);
  const portTwoValue = await input(portTwo);

  const xml = `<moduleOne-typeOne>${portOneValue}${portTwoValue}</moduleOne-typeOne>`;

  if (xmlFormatter) {
    const formattedXml = xmlFormatter(xml);
    logger.info(`\n${formattedXml}`);
    return formattedXml;
  } else {
    return xml;
  }
}

const portOne: TypedPort<string> = {
  name: "typeOnePortOne",
};

const portTwo: TypedPort<string> = {
  name: "typeOnePortTwo",
  singleArity: false,
};
