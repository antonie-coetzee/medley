import { Loader, Model, LoaderOptions, Type, Composition, TypedModel } from "./core";
import { TypeRepository } from "./TypeRepository";
import { ModelRepository } from "./ModelRepository";
import { ReturnedPromiseResolvedType, ViewEngine } from "./ViewEngine";
import { Migration } from "./Migration";

export interface MedleyOptions {
  loader?:LoaderOptions;
  eventHooks?: {
    typesUpdate?:(types:Type[])=>void;
    modelsOfTypeUpdate?:(type:Type, models:TypedModel[])=>void;
    modelUpdate?:(type:Type, model:TypedModel)=>void;
  };
}

export class Medley {
  private loadedComposition?: Composition;
  private modelRepository: ModelRepository;
  private typeRepository: TypeRepository;
  private migration: Migration;
  private viewEngine: ViewEngine;

  public constructor(private options: MedleyOptions) {
    const loader = new Loader(options.loader);
    this.typeRepository = new TypeRepository(loader);
    this.modelRepository = new ModelRepository();
    this.migration = new Migration(this.modelRepository, this.typeRepository);
    const getViewFunctionFromType = this.typeRepository.getViewFunction;
    const getModel = this.modelRepository.getModelById;
    this.viewEngine = new ViewEngine(this, getModel, getViewFunctionFromType);
  }

  public new = () => {
    return new Medley(this.options);
  }

  public updateOptions = (options: Partial<MedleyOptions>) =>{
    this.options = {...this.options, ...options};
  }

  public load = (composition: Composition, baseUrl: URL) => {
    this.loadedComposition = composition;
    this.typeRepository.load(composition.types, baseUrl);
    this.modelRepository.load(composition.modelsByType);
  }

  public getViewFunction = async <T extends Function>(
    modelId: string,
    context?: {}
  ): Promise<T> => {
    return this.viewEngine.getViewFunction(modelId, context);
  }

  
  public runViewFunction = async <T extends (...args: any) => any>(
    target:string | {modelId:string, context: {}},
    ...args:Parameters<T> 
  ): Promise<ReturnedPromiseResolvedType<T>> => {
    return this.viewEngine.runViewFunction(target, ...args);
  }

  public getTypedModelById = async (modelId: string) => {
    return this.modelRepository.getModelById(modelId);
  }

  public upsertTypedModel = (typedModel: Partial<TypedModel>) => {
    if(typedModel.typeId == null){
      throw new Error('typedModel requires typeId to be defined');
    }
    const type = this.typeRepository.getTypeById(typedModel.typeId);
    return this.upsertModel(type, typedModel);
  }

  public upsertModel = (type: Type, model: Partial<Model>) => {
    const hasType = this.typeRepository.hasTypeById(type.id);
    if (hasType === false) {
      this.typeRepository.addType(type);
      this.options?.eventHooks?.typesUpdate?.call(null, this.typeRepository.getTypes());
    }
    const {isNew,model:typedModel} = this.modelRepository.upsertModel({...model, typeId: type.id });
    if(isNew){
      this.options?.eventHooks?.modelsOfTypeUpdate?.call(null, type, this.modelRepository.getModelsByTypeId(type.id));
    } 
    this.options?.eventHooks?.modelUpdate?.call(null, type, typedModel);
    return typedModel;
  }

  public getModelsByTypeId = (typeId: string) => {
    return this.modelRepository.getModelsByTypeId(typeId);
  }

  public deleteModelById = (modelId: string) => {
    const typeId = this.modelRepository.getTypeIdFromModelId(modelId);
    this.modelRepository.deleteModelById(modelId);
    // delete type if not referenced
    if (typeId) {
      const models = this.modelRepository.getModelsByTypeId(typeId);
      if (models?.length == null || models?.length === 0) {
        this.typeRepository.deleteType(typeId);
        this.options?.eventHooks?.typesUpdate?.call(null, this.typeRepository.getTypes());
      }
    }
  }

  public getTypeById = (typeId: string) => {
    return this.typeRepository.getTypeById(typeId);
  }

  public getTypes = () => {
    return this.typeRepository.getTypes();
  }

  public getViewFunctionFromTypeId = async (typeId: string) => {
    return this.typeRepository.getViewFunction(typeId);
  }

  public getExportFromTypeId = async <T>(typeId: string, exportName: string) => {
    return this.typeRepository.getExport(typeId, exportName) as Promise<T>;
  }

  public deleteTypeById = (typeId: string) => {
    if(this.modelRepository.deleteModelsByTypeId(typeId)){
      this.options?.eventHooks?.modelsOfTypeUpdate?.call(null, this.typeRepository.getTypeById(typeId), []);
    }   
    if(this.typeRepository.deleteType(typeId)){
      this.options?.eventHooks?.typesUpdate?.call(null, this.typeRepository.getTypes());
    }
  }

  public migrateTypeUp = async (type:Type) => {
    return this.migration.up(type);
  }

  public migrateTypeDown = async (type:Type) => {
    return this.migration.down(type);
  }

  public getComposition = () => {
    const types = this.typeRepository.getTypes();
    const modelsByType = types.map((el) => {
      return {
        typeId: el.id,
        models: this.modelRepository
          .getModelsByTypeId(el.id)
          // remove the typeid as it is dedundant, converting into a plain model type
          .map((tm) => ({ ...tm, typeId: undefined })),
      };
    });
    return {
      ...this.loadedComposition,
      types,
      modelsByType,
    };
  }
}
