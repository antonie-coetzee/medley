import { ModelViewEngine } from "../ModelViewEngine";
import path from "path"

it('it can load and render a model', async () => {
    const mve = new ModelViewEngine();
    //mve.setBasePath("file://" + path.resolve( __dirname) + "/assets/");
    mve.setBasePath("http://localhost:3000/assets/");
    await mve.load("models.json");
    const res = await mve.renderModel("e0754165-d127-48be-92c5-85fc25dbca19",[]);
    console.log(res);
});