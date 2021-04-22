import { ModelViewEngine } from "../ModelViewEngine.js";
import path from "path"
import { CompositionRepository } from "../CompositionRepository.js";
import fs  from "fs";


// it('it can load and render a model', async () => {
//     const compoRepo = new CompositionRepository();
//     const basePath = path.resolve( __dirname);
//     const imported = await import("file:///C:/Dev/medley/packages/medley-mve/src/Tests/assets/moduleOne.mjs");

//     //await compoRepo.loadFromUrl(new URL("file://C:/Dev/medley/packages/medley-mve/src/Tests/assets/composition.json"));
//     //const mve = new ModelViewEngine(compoRepo);
//     //const res = await mve.renderModel("e0754165-d127-48be-92c5-85fc25dbca19",[]);

//     //const res = new URL("file:" + path.resolve( __dirname) + "/assets/models.json").toString();
//     //const url = new URL("file://C:/Dev/medley/packages/medley-mve/src/Tests/assets/composition.json");
//     //const res = new URL("file://C:/Dev/medley/packages/medley-mve/src/Tests/assets/models.json").toString();
//     //fs.readFileSync(url);

//     //console.log(res);
// });

(async () => {
    const compoRepo = new CompositionRepository();
    const imported = await import("file:///C:/Dev/medley/packages/medley-mve/src/Tests/assets/moduleOne.mjs");

    await compoRepo.loadFromUrl(new URL("file://C:/Dev/medley/packages/medley-mve/src/Tests/assets/composition.json"));
    const mve = new ModelViewEngine(compoRepo);
    const res = await mve.renderModel("e0754165-d127-48be-92c5-85fc25dbca19",[]);

    // const res = new URL("file:" + path.resolve( __dirname) + "/assets/models.json").toString();
    // const url = new URL("file://C:/Dev/medley/packages/medley-mve/src/Tests/assets/composition.json");
    // const res = new URL("file://C:/Dev/medley/packages/medley-mve/src/Tests/assets/models.json").toString();
    // fs.readFileSync(url);

    console.log(res);
})();