import { ModelViewEngine } from "../ModelViewEngine.ts";
import { CompositionRepository } from "../CompositionRepository.ts";

Deno.test("can render simple composition", async () => {
  const compoRepo = new CompositionRepository();
  await compoRepo.loadFromUrl(
    new URL(
      "file://C:/Dev/medley/packages/medley-mve/src/Tests/assets/composition.js",
    ),
  );
  const mve = new ModelViewEngine(compoRepo);
  const res = await mve.renderModel("e0754165-d127-48be-92c5-85fc25dbca19", []);
  console.log(res);
});
