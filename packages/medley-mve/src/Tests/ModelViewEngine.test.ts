import { ModelViewEngine } from "../ModelViewEngine";
import path from "path"
import { CompositionRepository } from "../CompositionRepository";
import fs  from "fs";
import {URL} from "url"

it('it can load and render a model', async () => {
    const compoRepo = new CompositionRepository();
    await compoRepo.loadFromUrl("file://" + path.resolve( __dirname) + "/assets/composition.json");
    const mve = new ModelViewEngine(compoRepo);
    const res = await mve.renderModel("e0754165-d127-48be-92c5-85fc25dbca19",[]);

    //const res = new URL("file:" + path.resolve( __dirname) + "/assets/models.json").toString();
    //const url = new URL("file://C:/Dev/medley/packages/medley-mve/src/Tests/assets/composition.json");
    //const res = new URL("file://C:/Dev/medley/packages/medley-mve/src/Tests/assets/models.json").toString();
    //fs.readFileSync(url);

    console.log(res);
});