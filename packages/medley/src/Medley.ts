import {
  Loader,
  Model,
  LoaderOptions,
  Type,
  Composition,
  TypedModel,
  Logger,
  nullLogger,
} from "./core";
import { TypeRepository } from "./TypeRepository";
import { ModelRepository } from "./ModelRepository";
import { ViewEngine, ReturnedPromiseType } from "./ViewEngine";

export interface MedleyOptions {
  loader: LoaderOptions;
  logger?: Logger;
  eventHooks?: {
    typesUpdate?: (types: Type[]) => void;
    modelsOfTypeUpdate?: (type: Type, models: TypedModel[]) => void;
    modelUpdate?: (type: Type, model: TypedModel) => void;
  };
}

export class Medley { 
  private composition?: Composition;
  private modelRepository: ModelRepository;
  private typeRepository: TypeRepository;
  private viewEngine: ViewEngine;
  private baseLogger: Logger;

  public constructor(private options: MedleyOptions) {
    const loader = new Loader(options.loader);
    this.typeRepository = new TypeRepository(loader);
    this.modelRepository = new ModelRepository();
    const getViewFunctionFromType = this.typeRepository.getViewFunction;
    const getModel = this.modelRepository.getModel;
    this.viewEngine = new ViewEngine(this, getModel, getViewFunctionFromType);
    this.baseLogger = options.logger || nullLogger;
  }

  public new = () => {
    return new Medley(this.options);
  };

  public updateOptions = (options: Partial<MedleyOptions>) => {
    this.options = this.mergeDeep(this.options, options);
  };

  public import = (composition: Composition, baseUrl: URL) => {
    this.composition = composition;
    this.typeRepository.load(composition.parts, baseUrl);
    const loadedTypes = this.typeRepository.getTypes();
    this.options?.eventHooks?.typesUpdate?.call(null, loadedTypes);
    this.modelRepository.load(composition.parts);
    if (this.options?.eventHooks?.modelsOfTypeUpdate) {
      const modelsOfTypeUpdate = this.options.eventHooks.modelsOfTypeUpdate;
      loadedTypes.forEach((type) => {
        modelsOfTypeUpdate(
          type,
          this.modelRepository.getModelsByType(type.name)
        );
      });
    }
  };

  public getViewFunction = async <T extends Function>(
    modelId: string,
    context?: {}
  ): Promise<T> => {
    this.checkComposition();
    return this.viewEngine.getViewFunction(modelId, context);
  };

  public runViewFunction = async <T extends (...args: any) => any>(
    target: string | { modelId: string; context: {} },
    ...args: Parameters<T>
  ): Promise<ReturnedPromiseType<T>> => {
    this.checkComposition();
    return this.viewEngine.runViewFunction(target, ...args);
  };

  public getComposition = () => {
    return this.composition;
  }

  public updateComposition = (updator:<T extends Composition>(composition:T)=>T) => {
    this.checkComposition();
    if(this.composition && updator){
      this.composition = updator(this.composition);
    }
  }

  public getReferences = (modelId:string) =>{
    const references = this.modelRepository.getReferences(modelId);
    if(references){
      return references.map(ref=>this.modelRepository.getModel(ref));
    }
  }

  public getTypedModel = (modelId: string) => {
    this.checkComposition();
    return this.modelRepository.getModel(modelId);
  };

  public upsertTypedModel = (typedModel: Partial<TypedModel>) => {
    this.checkComposition();
    if (typedModel.typeName == null) {
      throw new Error("typedModel requires typeName to be defined");
    }
    const type = this.typeRepository.getType(typedModel.typeName);
    return this.upsertModel(type, typedModel);
  };

  public upsertModel = (type: Type, model: Partial<Model>) => {
    this.checkComposition();
    const hasType = this.typeRepository.hasType(type.name);
    if (hasType === false) {
      this.typeRepository.addType(type);
      this.options?.eventHooks?.typesUpdate?.call(
        null,
        this.typeRepository.getTypes()
      );
    }
    const { isNew, model: typedModel } = this.modelRepository.upsertModel({
      ...model,
      typeName: type.name,
    });
    if (isNew) {
      this.options?.eventHooks?.modelsOfTypeUpdate?.call(
        null,
        type,
        this.modelRepository.getModelsByType(type.name)
      );
    }
    this.options?.eventHooks?.modelUpdate?.call(null, type, typedModel);
    return typedModel;
  };

  public getModelsByType = (typeName: string) => {
    this.checkComposition();
    return this.modelRepository.getModelsByType(typeName);
  };

  public deleteModelById = (modelId: string) => {
    this.checkComposition();
    const typeName = this.modelRepository.getTypeNameFromModelId(modelId);
    if(typeName == null){
      throw new Error(`type name for model with id: '${modelId}', not found`);
    }
    const type = this.typeRepository.getType(typeName);
    const deleted = this.modelRepository.deleteModel(modelId);
    
    if(deleted){
      this.options?.eventHooks?.modelsOfTypeUpdate?.call(
        null,
        type,
        this.modelRepository.getModelsByType(type.name)
      );
      const models = this.modelRepository.getModelsByType(typeName);
      // delete type if not referenced
      if (models?.length == null || models?.length === 0) {
        this.typeRepository.deleteType(typeName);
        this.options?.eventHooks?.typesUpdate?.call(
          null,
          this.typeRepository.getTypes()
        );
      }
    }
  };

  public getType = (typeName: string) => {
    this.checkComposition();
    return this.typeRepository.getType(typeName);
  };

  public getTypes = () => {
    this.checkComposition();
    return this.typeRepository.getTypes();
  };

  public getViewFunctionFromType = async (typeName: string) => {
    this.checkComposition();
    return this.typeRepository.getViewFunction(typeName);
  };

  public getExportFromType = async <T>(
    typeName: string,
    exportName: string
  ) => {
    this.checkComposition();
    return this.typeRepository.getExport(typeName, exportName) as Promise<T>;
  };

  public deleteType = (typeName: string) => {
    this.checkComposition();
    if (this.modelRepository.deleteModelsByType(typeName)) {
      this.options?.eventHooks?.modelsOfTypeUpdate?.call(
        null,
        this.typeRepository.getType(typeName),
        []
      );
    }
    if (this.typeRepository.deleteType(typeName)) {
      this.options?.eventHooks?.typesUpdate?.call(
        null,
        this.typeRepository.getTypes()
      );
    }
  };

  public export = <T extends Composition = Composition>() => {
    this.checkComposition();
    const types = this.typeRepository.getTypes();
    const modelsWithType = types.map((type) => {
      return {
        type: type,
        models: this.modelRepository
          .getModelsByType(type.name)
          // remove redundant typeName
          .map((tm) => ({ ...tm, typeName: undefined })),
      };
    });
    if (this.composition) {
      const currentState = {
        ...(this.composition as T),
        parts: modelsWithType,
      };
      // return clone to avoid externally introduced side-effects
      return JSON.parse(JSON.stringify(currentState)) as T
    }
  };

  public getLogger = () => {
    return this.baseLogger;
  }

  private checkComposition(){
    if(this.composition == null){
      throw new Error("composition not present");
    }
  }

  private mergeDeep(...objects: any[]) {
    if(objects == null){
      return;
    }
    
    const isObject = (obj: any) => obj && typeof obj === "object";

    return objects.reduce((prev, obj) => {
      Object.keys(obj).forEach((key) => {
        const pVal = prev[key];
        const oVal = obj[key];

        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          prev[key] = pVal.concat(...oVal);
        } else if (isObject(pVal) && isObject(oVal)) {
          prev[key] = this.mergeDeep(pVal, oVal);
        } else {
          prev[key] = oVal;
        }
      });

      return prev;
    }, {});
  }
}
