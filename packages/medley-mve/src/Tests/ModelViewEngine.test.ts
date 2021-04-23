import { ModelViewEngine } from "../ModelViewEngine.js";
import { CompositionRepository } from "../CompositionRepository.js";

import { URL } from "url";



it('it can load and render a model', async () => {
    const compoRepo = new CompositionRepository();

    await compoRepo.loadFromUrl(new URL("file://C:/Dev/medley/packages/medley-mve/src/Tests/assets/composition.json"));
    const mve = new ModelViewEngine(compoRepo);
    const res = await mve.renderModel("e0754165-d127-48be-92c5-85fc25dbca19",[]);
    console.log(res);
});