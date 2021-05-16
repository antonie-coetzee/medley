import { __awaiter } from "tslib";
import { ModelRepository } from "./Models";
import { TypeRepository } from "./Types";
export class CompositionRepository {
    constructor(options) {
        this.import = (url) => import(url);
        this.modelRepository = (options === null || options === void 0 ? void 0 : options.modelRepository) || new ModelRepository();
        this.typeRepository = (options === null || options === void 0 ? void 0 : options.typeRepository) || new TypeRepository();
        this.import = (options === null || options === void 0 ? void 0 : options.import) || this.import;
    }
    load(composition, url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (composition.types.name === undefined) {
                yield this.typeRepository.loadFromUrl(new URL(composition.types.toString(), url));
            }
            else {
                yield this.typeRepository.load(composition.types);
            }
            yield this.modelRepository.load(composition.modelsByType);
        });
    }
    loadFromUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            var module = yield this.import(url.toString());
            const composition = module.default;
            yield this.load(composition, url);
        });
    }
    get composition() {
        const mot = Array.from(this.modelRepository.modelsByTypeId.values());
        const mbt = mot.map((val) => {
            val.models = val.models.map((m) => {
                return Object.assign(Object.assign({}, m), { typeId: undefined });
            });
            return val;
        });
        return {
            types: this.typeRepository.typesUrl
                ? new URL(this.typeRepository.typesUrl.toString())
                : this.typeRepository.typeTree || {},
            modelsByType: mbt,
        };
    }
}
//# sourceMappingURL=CompositionRepository.js.map