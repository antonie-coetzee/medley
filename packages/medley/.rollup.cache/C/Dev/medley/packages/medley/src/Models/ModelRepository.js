import { __awaiter } from "tslib";
import { v4 as uuidv4 } from "uuid";
export class ModelRepository {
    constructor(options) {
        this.modelsById = new Map();
        this.typedModelLoadHook = (tm) => tm;
        this.modelsByTypeId = new Map();
        this.modelsOfTypeLoadHook = (mot) => mot;
        this.getModelById = this.getModelById.bind(this);
        this.updateOptions(options);
    }
    updateOptions(options) {
        this.typedModelLoadHook = (options === null || options === void 0 ? void 0 : options.typedModelLoadHook) ||
            this.typedModelLoadHook;
        this.modelsOfTypeLoadHook = (options === null || options === void 0 ? void 0 : options.modelsOfTypeLoadHook) ||
            this.modelsOfTypeLoadHook;
    }
    load(modelsByType) {
        return __awaiter(this, void 0, void 0, function* () {
            this.modelsById.clear();
            this.modelsByTypeId.clear();
            modelsByType.forEach((modelsWithTypeId) => {
                const modelsOfType = this.modelsOfTypeLoadHook(modelsWithTypeId);
                this.modelsByTypeId.set(modelsWithTypeId.typeId, modelsOfType);
                const typeId = modelsWithTypeId.typeId;
                modelsWithTypeId.models.forEach((model) => {
                    const typedModel = this.typedModelLoadHook(model);
                    typedModel.typeId = typeId;
                    this.modelsById.set(model.id, typedModel);
                });
            });
        });
    }
    getModelById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.modelsById.get(id);
            if (model === undefined)
                throw new Error(`model with id: ${id}, not found`);
            return Promise.resolve(model);
        });
    }
    getModelsByTypeId(typeId) {
        return this.modelsByTypeId.get(typeId);
    }
    upsertModel(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentModel = this.modelsById.get(model.id || "");
            if ((currentModel === null || currentModel === void 0 ? void 0 : currentModel.typeId) === undefined && model.typeId === undefined) {
                throw new Error("typeId missing");
            }
            const typeId = (currentModel === null || currentModel === void 0 ? void 0 : currentModel.typeId) || model.typeId || "";
            const uModel = Object.assign(Object.assign({}, model), { typeId, id: (currentModel === null || currentModel === void 0 ? void 0 : currentModel.id) || uuidv4(), name: model.name || (currentModel === null || currentModel === void 0 ? void 0 : currentModel.name) });
            const modelGroup = this.getModelsByTypeId(typeId);
            if (modelGroup === undefined) {
                // no models of this type yet
                const modelsOfType = this.modelsOfTypeLoadHook({
                    typeId,
                    models: [uModel],
                });
                this.modelsByTypeId.set(typeId, modelsOfType);
            }
            else if (currentModel === undefined) {
                // new model instert
                modelGroup.models.push(this.typedModelLoadHook(uModel));
            }
            this.modelsById.set(uModel.id, uModel); // add/update model index
        });
    }
    deleteModelById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.modelsById.delete(id);
        });
    }
}
//# sourceMappingURL=ModelRepository.js.map