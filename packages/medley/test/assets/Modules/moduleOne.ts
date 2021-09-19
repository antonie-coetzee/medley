import { NF, UniPort } from "medley";

export const nodeFunction: NF<{
  xmlFormatter?: (xmlString: string) => string;
}> = async ({ logger, xmlFormatter, input }, testArg: string) => {
  logger.info("log from ModuleOne.typeOne");
  const portOneValue = await input(portOne);
  const portTwoValue = await input<typeof portTwo>({
    ...portTwo,
    context: { customContextProp: testArg },
  });

  const xml = `<moduleOne-typeOne>${portOneValue}${portTwoValue}</moduleOne-typeOne>`;

  if (xmlFormatter) {
    const formattedXml = xmlFormatter(xml);
    logger.info(`\n${formattedXml}`);
    return formattedXml;
  } else {
    return xml;
  }
};

const portOne: UniPort<string> = {
  name: "typeOnePortOne",
};

const portTwo: UniPort<string> = {
  name: "typeOnePortTwo",
};
