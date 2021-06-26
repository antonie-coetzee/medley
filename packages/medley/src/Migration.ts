import { Loader, Type } from "./core";
import { ModelRepository } from "./ModelRepository";
import { TypeRepository } from "./TypeRepository";

export class Migration {
  constructor(
    private modelRepository: ModelRepository,
    private typeRepository: TypeRepository
  ) {}

  public async up(type: Type){
    if(type.parentId == null){
      throw new Error(`type: '${type.id}' parent id not valid`);
    }
    const models = this.modelRepository.getModelsByTypeId(type.parentId);
    if(models.length <= 0){
      // nothing to migrate
      return;
    } 
    try{
      this.typeRepository.addType(type);  
      const migrateUpFunc = await this.typeRepository.getMigrateUpFunction(type.id);
      const upBuffer:Map<string,{}> = new Map();
      models.forEach(m=>{
        upBuffer.set(m.id, migrateUpFunc(m.value));
      });
      // no errors, safe to apply
      models.forEach(m=>{
        m.value = upBuffer.get(m.id);
        m.typeId = type.id;
      });
      // delete previous type
      this.typeRepository.deleteType(type.parentId);
    }catch(e){
      this.typeRepository.deleteType(type.id);
      throw e;
    }
  }

  public async down(type: Type){
    const types = this.typeRepository.getTypes();
    const currentType = types.find(t=>t.parentId === type.id);
    if(currentType == null){
      throw new Error(`no parent id match for: '${type.id}' `);
    }
    const models = this.modelRepository.getModelsByTypeId(currentType.id);
    if(models.length <= 0){
      // nothing to migrate
      return;
    }   
    try{     
      this.typeRepository.addType(type);
      const migrateDownFunc = await this.typeRepository.getMigrateDownFunction(currentType.id);
      const downBuffer:Map<string,{}> = new Map();
      models.forEach(m=>{
        downBuffer.set(m.id, migrateDownFunc(m.value));
      });
      // no errors, safe to apply
      models.forEach(m=>{
        m.value = downBuffer.get(m.id);
        m.typeId = type.id;
      });
      // delete previous type
      this.typeRepository.deleteType(currentType.id);
    }catch(e){
      this.typeRepository.deleteType(type.id);
      throw e;
    }
  }  
}
