import { __asyncValues, __awaiter } from "tslib";
export class TypeRepository {
    constructor(options) {
        this.typeVersionMap = new Map();
        this.onResolvedTypeTreeUpdate = () => { };
        this.onTypeTreeUpdate = () => { };
        this.onTypesUrlUpdate = () => { };
        this.import = (url) => import(url);
        this.updateOptions(options);
        this.getViewFunction = this.getViewFunction.bind(this);
    }
    updateOptions(options) {
        this.onResolvedTypeTreeUpdate = (options === null || options === void 0 ? void 0 : options.onResolvedTypeTreeUpdate) ||
            this.onResolvedTypeTreeUpdate;
        this.onTypeTreeUpdate = (options === null || options === void 0 ? void 0 : options.onTypeTreeUpdate) || this.onTypeTreeUpdate;
        this.onTypesUrlUpdate = (options === null || options === void 0 ? void 0 : options.onTypesUrlUpdate) || this.onTypesUrlUpdate;
        this.import = (options === null || options === void 0 ? void 0 : options.import) || this.import;
    }
    loadFromUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            this.typesUrl = url;
            this.onTypesUrlUpdate(this.typesUrl);
            var module = yield this.import(url.toString());
            const typeTree = module.default;
            return this.load(typeTree);
        });
    }
    load(typeTree) {
        return __awaiter(this, void 0, void 0, function* () {
            this.typeTree = typeTree;
            this.onTypeTreeUpdate(this.typeTree);
            this.resolvedTypeTree = {
                name: typeTree.name,
                iconUrl: typeTree.iconUrl,
                types: [],
                groups: [],
            };
            this.typeVersionMap = new Map();
            yield this.resolveTypeTree(typeTree, this.resolvedTypeTree);
            this.onResolvedTypeTreeUpdate(this.resolvedTypeTree);
        });
    }
    versionToType(versionId) {
        const { type } = this.typeVersionMap.get(versionId) || {};
        return type;
    }
    getViewFunction(typeVersionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type, version } = this.typeVersionMap.get(typeVersionId) || {};
            if (type === undefined || version === undefined) {
                throw new Error(`type with version id: ${typeVersionId} not found`);
            }
            const typeModuleUrl = new URL(version.viewFunction.url.toString(), this.typesUrl);
            if (typeModuleUrl === undefined) {
                throw new Error("typeModuleUrl is undefined");
            }
            const typeModule = yield this.import(typeModuleUrl.toString());
            if (version.viewFunction.name) {
                return typeModule[version.viewFunction.name];
            }
            else {
                return typeModule.default;
            }
        });
    }
    resolveTypeTree(partialTypeTree, resolvedTypeTree) {
        var e_1, _a, e_2, _b;
        var _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (var _d = __asyncValues(partialTypeTree.types), _e; _e = yield _d.next(), !_e.done;) {
                    const type = _e.value;
                    if (type.name === undefined) {
                        const typeUrl = new URL(type.toString(), this.typesUrl);
                        const typeLoaded = yield this.loadType(typeUrl);
                        resolvedTypeTree.types.push(typeLoaded);
                        this.indexType(typeLoaded);
                    }
                    else {
                        this.indexType(type);
                        resolvedTypeTree.types.push(type);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) yield _a.call(_d);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (partialTypeTree.groups !== undefined) {
                try {
                    for (var _f = __asyncValues(partialTypeTree.groups), _g; _g = yield _f.next(), !_g.done;) {
                        const group = _g.value;
                        let groupTypeTree;
                        if (group.name === undefined) {
                            const groupUrl = new URL(group.toString(), this.typesUrl);
                            groupTypeTree = yield this.loadGroup(groupUrl);
                        }
                        else {
                            groupTypeTree = group;
                        }
                        const resolvedGroup = {
                            name: groupTypeTree.name,
                            iconUrl: groupTypeTree.iconUrl,
                            types: [],
                            groups: [],
                        };
                        (_c = resolvedTypeTree.groups) === null || _c === void 0 ? void 0 : _c.push(resolvedGroup);
                        yield this.resolveTypeTree(groupTypeTree, resolvedGroup);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f.return)) yield _b.call(_f);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        });
    }
    indexType(type) {
        type.versions.forEach((version) => {
            this.typeVersionMap.set(version.id, { type, version });
        });
    }
    loadGroup(url) {
        return __awaiter(this, void 0, void 0, function* () {
            var module = yield this.import(url.toString());
            const typeTree = module.default;
            return typeTree;
        });
    }
    loadType(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const typeModule = yield this.import(url.toString());
            const type = typeModule.default;
            return type;
        });
    }
}
//# sourceMappingURL=TypeRepository.js.map