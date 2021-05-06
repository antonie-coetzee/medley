export default async (cntx) => {
  const config = cntx.model.value;
  const res = await cntx.viewEngine.renderModel(config.childModel);
  return "Child module return value: " + res;
};
