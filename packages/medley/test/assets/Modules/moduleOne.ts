import { Context } from "medley";

interface ChildModuleViewFunction {
  (): Promise<string>;
}

interface ModuleThreeViewFunction {
  (arg01:String): Promise<string>;
}

type config = {
  childModelTwoId: string;
  childModelThreeId: string;
};

export async function viewFunction(this: Context) {
  const config = this.medley.getModelValue<config>();
  if (config == null) {
    return;
  }

  const modelTwoReturn = await this.medley.runViewFunction<ChildModuleViewFunction>(
    {modelId: config.childModelTwoId,
      context: { customContextProp: "custom value" }}
  );

  const viewFuncThreeReturn = await this.medley.runViewFunction<ModuleThreeViewFunction>(
    config.childModelThreeId,
    "moduleThree argument"
  );
  return `<moduleOne>
  ${modelTwoReturn}
  ${viewFuncThreeReturn}
</moduleOne>`
}
