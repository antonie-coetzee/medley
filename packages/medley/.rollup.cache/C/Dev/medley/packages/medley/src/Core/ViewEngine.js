import { __awaiter } from "tslib";
export class ViewEngine {
    constructor(getModel, getViewFunction) {
        this.getModel = getModel;
        this.getViewFunction = getViewFunction;
        this.context = {};
        this.setContext = this.setContext.bind(this);
        this.renderModel = this.renderModel.bind(this);
    }
    getContext() {
        return this.context;
    }
    setContext(context) {
        this.context = context;
    }
    renderModel(modelId, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!modelId)
                throw new Error("modelId is null or empty");
            const model = yield this.getModel(modelId);
            const viewFunction = yield this.getViewFunction(model.typeId);
            let oldContext = this.context;
            let viewEngine = {
                renderModel: this.renderModel,
                setContext: this.setContext,
            };
            let cntx = Object.assign(Object.assign({}, this.context), { model,
                viewEngine });
            try {
                return yield viewFunction(cntx, ...args);
            }
            finally {
                this.context = oldContext;
            }
        });
    }
}
//# sourceMappingURL=ViewEngine.js.map