import {
  Loader,
  Model,
  LoaderOptions,
  Type,
  Composition,
  TypedModel,
} from "./core";
import { TypeRepository } from "./TypeRepository";
import { ModelRepository } from "./ModelRepository";
import { ViewEngine, ReturnedPromiseType } from "./ViewEngine";

export interface MedleyOptions {
  loader: LoaderOptions;
  eventHooks?: {
    typesUpdate?: (types: Type[]) => void;
    modelsOfTypeUpdate?: (type: Type, models: TypedModel[]) => void;
    modelUpdate?: (type: Type, model: TypedModel) => void;
  };
}

export class Medley {
  private loadedComposition?: Composition;
  private modelRepository: ModelRepository;
  private typeRepository: TypeRepository;
  private viewEngine: ViewEngine;

  public constructor(private options: MedleyOptions) {
    const loader = new Loader(options.loader);
    this.typeRepository = new TypeRepository(loader);
    this.modelRepository = new ModelRepository();
    const getViewFunctionFromType = this.typeRepository.getViewFunction;
    const getModel = this.modelRepository.getModel;
    this.viewEngine = new ViewEngine(this, getModel, getViewFunctionFromType);
  }

  public new = () => {
    return new Medley(this.options);
  };

  public updateOptions = (options: Partial<MedleyOptions>) => {
    this.options = this.mergeDeep(this.options, options);
  };

  public import = (composition: Composition, baseUrl: URL) => {
    this.loadedComposition = composition;
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

  public runMainViewFunction = async <T extends (...args: any) => any>(
    context: {},
    ...args: Parameters<T>
  ): Promise<ReturnedPromiseType<T>> => {
    if (this.loadedComposition?.mainModelId == null) {
      throw new Error("mainModelId not defined on loaded composition");
    }
    return this.viewEngine.runViewFunction(
      { modelId: this.loadedComposition.mainModelId, context },
      ...args
    );
  };

  public getViewFunction = async <T extends Function>(
    modelId: string,
    context?: {}
  ): Promise<T> => {
    return this.viewEngine.getViewFunction(modelId, context);
  };

  public runViewFunction = async <T extends (...args: any) => any>(
    target: string | { modelId: string; context: {} },
    ...args: Parameters<T>
  ): Promise<ReturnedPromiseType<T>> => {
    return this.viewEngine.runViewFunction(target, ...args);
  };

  public getComposition = () => {
    return this.loadedComposition;
  }

  public updateComposition = (updator:<T extends Composition>(composition:T)=>T) => {
    if(this.loadedComposition && updator){
      this.loadedComposition = updator(this.loadedComposition);
    }
  }

  public getMainModelId = () => {
    return this.loadedComposition?.mainModelId;
  };

  public setMainModelId = (modelId: string) => {
    if (this.loadedComposition) {
      this.loadedComposition.mainModelId = modelId;
    }
  };

  public getTypedModel = (modelId: string) => {
    return this.modelRepository.getModel(modelId);
  };

  public upsertTypedModel = (typedModel: Partial<TypedModel>) => {
    if (typedModel.typeName == null) {
      throw new Error("typedModel requires typeName to be defined");
    }
    const type = this.typeRepository.getType(typedModel.typeName);
    return this.upsertModel(type, typedModel);
  };

  public upsertModel = (type: Type, model: Partial<Model>) => {
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
    return this.modelRepository.getModelsByType(typeName);
  };

  public deleteModelById = (modelId: string) => {
    const typeName = this.modelRepository.getTypeNameFromModelId(modelId);
    this.modelRepository.deleteModel(modelId);
    // delete type if not referenced
    if (typeName) {
      const models = this.modelRepository.getModelsByType(typeName);
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
    return this.typeRepository.getType(typeName);
  };

  public getTypes = () => {
    return this.typeRepository.getTypes();
  };

  public getViewFunctionFromType = async (typeName: string) => {
    return this.typeRepository.getViewFunction(typeName);
  };

  public getExportFromType = async <T>(
    typeName: string,
    exportName: string
  ) => {
    return this.typeRepository.getExport(typeName, exportName) as Promise<T>;
  };

  public deleteType = (typeName: string) => {
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
    const types = this.typeRepository.getTypes();
    const modelsWithType = types.map((type) => {
      return {
        type: type,
        models: this.modelRepository
          .getModelsByType(type.name)
          // remove redundant typeId
          .map((tm) => ({ ...tm, typeId: undefined })),
      };
    });
    if (this.loadedComposition) {
      return {
        ...(this.loadedComposition as T),
        parts: modelsWithType,
      };
    }
  };

  private mergeDeep(...objects: any[]) {
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
