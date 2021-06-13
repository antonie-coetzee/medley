import { Context } from "medley";

interface ChildModuleViewFunction {
  (): Promise<string>;
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

  const viewFunc = await this.medley.getViewFunction<ChildModuleViewFunction>(
    config.childModelTwoId,
    { customContextProp: "custom value" }
  );
  const res = await viewFunc();
  const viewFuncThree = await this.medley.getViewFunction<ChildModuleViewFunction>(
    config.childModelThreeId
  );
  const resThree = await viewFuncThree();

  return "<moduleOne> " + res + resThree;
}
