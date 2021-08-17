import { NF, TypedPort} from "medley";

const nodeFunction: NF<{
  customContextProp: string;
  xmlFormatter?: (xmlString: string) => string;
}> = async (cntx, testArg:string) => {
  const {logger, port, xmlFormatter } = cntx;
  logger.info("log from ModuleOne.typeOne");
  cntx.customContextProp = testArg;
  const portOneValue = await port.input(portOne);
  const portTwoValue = await port.input(portTwo);

  const xml = `<moduleOne-typeOne>${portOneValue}${portTwoValue}</moduleOne-typeOne>`;

  if (xmlFormatter) {
    const formattedXml = xmlFormatter(xml);
    logger.info(`\n${formattedXml}`);
    return formattedXml;
  } else {
    return xml;
  }
};

nodeFunction.ports = ()=>{
  return [portOne, portTwo];
}

export default nodeFunction;

const portOne: TypedPort<string> = {
  name: "typeOnePortOne",
};

const portTwo: TypedPort<string> = {
  name: "typeOnePortTwo",
  singleArity: false 
};



