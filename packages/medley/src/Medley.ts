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
  private composition?: Composition;
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

  public runMainViewFunction = async <T extends (...args: any) => any>(
    context: {},
    ...args: Parameters<T>
  ): Promise<ReturnedPromiseType<T>> => {
    this.checkComposition();
    const mainModel = this.modelRepository.getMainModel();
    if (mainModel == null) {
      throw new Error("main model not found");
    }
    return this.viewEngine.runViewFunction(
      { modelId: mainModel.id, context },
      ...args
    );
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

  public getMainModel = () => {
    this.checkComposition();
    return this.modelRepository.getMainModel();
  };

  public setMainModel = (modelId:string) => {
    this.checkComposition();
    this.modelRepository.setMainModel(modelId);
  };

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
          // remove redundant typeId
          .map((tm) => ({ ...tm, typeId: undefined })),
      };
    });
    if (this.composition) {
      return {
        ...(this.composition as T),
        parts: modelsWithType,
      };
    }
  };

  private checkComposition(){
    if(this.composition == null){
      throw new Error("composition not present");
    }
  }

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
