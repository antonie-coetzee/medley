import { __awaiter } from "tslib";
import { ViewEngine } from "./Core";
export class ModelViewEngine {
    constructor(compositionRepo) {
        const getModel = compositionRepo.modelRepository.getModelById;
        const getViewFunction = compositionRepo.typeRepository.getViewFunction;
        this.viewEngine = new ViewEngine(getModel, getViewFunction);
    }
    renderModel(modelId, args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.viewEngine.renderModel(modelId, args);
        });
    }
}
//# sourceMappingURL=ModelViewEngine.js.map