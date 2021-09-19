import {
  MedleyOptions,
  LinkRepo,
  TypeRepo,
  Loader,
  NodeRepo,
  Medley,
} from "medley";
import {compositeType} from "../../src"

async function addTypes(medley:Medley){
  medley.types.addType(compositeType)
}

export function createMedleyInstance() {
  const options: MedleyOptions = {
    linkRepo: new LinkRepo(),
    typeRepo: new TypeRepo(new Loader()),
    nodeRepo: new NodeRepo(),
  };
  const medley = new Medley(options);
  addTypes(medley);
  return medley;
}