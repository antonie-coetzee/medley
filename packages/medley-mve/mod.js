class TypeRepository1 {
  typeVersionMap = new Map();
  onResolvedTypeTreeUpdate = () => {
  };
  onTypeTreeUpdate = () => {
  };
  onTypesUrlUpdate = () => {
  };
  typesUrl;
  resolvedTypeTree;
  typeTree;
  constructor(options1) {
    this.getViewFunction = this.getViewFunction.bind(this);
  }
  updateOptions(options) {
    this.onResolvedTypeTreeUpdate = options?.onResolvedTypeTreeUpdate ||
      this.onResolvedTypeTreeUpdate;
    this.onTypeTreeUpdate = options?.onTypeTreeUpdate || this.onTypeTreeUpdate;
    this.onTypesUrlUpdate = options?.onTypesUrlUpdate || this.onTypesUrlUpdate;
  }
  async loadFromUrl(url) {
    this.typesUrl = url;
    this.onTypesUrlUpdate(this.typesUrl);
    var module = await import(url.toString());
    const typeTree = module.default;
    return this.load(typeTree);
  }
  async load(typeTree) {
    this.typeTree = typeTree;
    this.onTypeTreeUpdate(this.typeTree);
    this.resolvedTypeTree = {
      name: typeTree.name,
      iconUrl: typeTree.iconUrl,
      types: [],
      groups: [],
    };
    this.typeVersionMap = new Map();
    await this.resolveTypeTree(typeTree, this.resolvedTypeTree);
    this.onResolvedTypeTreeUpdate(this.resolvedTypeTree);
  }
  versionToType(versionId) {
    const { type } = this.typeVersionMap.get(versionId) || {};
    return type;
  }
  async getViewFunction(typeVersionId) {
    const { type, version } = this.typeVersionMap.get(typeVersionId) || {};
    if (type === undefined || version === undefined) {
      throw new Error(`type with version id: ${typeVersionId} not found`);
    }
    const typeModuleUrl = new URL(
      version.viewFunction.url.toString(),
      this.typesUrl,
    );
    if (typeModuleUrl === undefined) {
      throw new Error("typeModuleUrl is undefined");
    }
    const typeModule = await import(typeModuleUrl.toString());
    if (version.viewFunction.name) {
      return typeModule[version.viewFunction.name];
    } else {
      return typeModule.default;
    }
  }
  async resolveTypeTree(partialTypeTree, resolvedTypeTree) {
    for await (const type of partialTypeTree.types) {
      if (type.name === undefined) {
        const typeUrl = new URL(type.toString(), this.typesUrl);
        const typeLoaded = await this.loadType(typeUrl);
        resolvedTypeTree.types.push(typeLoaded);
        this.indexType(typeLoaded);
      } else {
        this.indexType(type);
        resolvedTypeTree.types.push(type);
      }
    }
    if (partialTypeTree.groups !== undefined) {
      for await (const group of partialTypeTree.groups) {
        let groupTypeTree;
        if (group.name === undefined) {
          const groupUrl = new URL(group.toString(), this.typesUrl);
          groupTypeTree = await this.loadGroup(groupUrl);
        } else {
          groupTypeTree = group;
        }
        const resolvedGroup = {
          name: groupTypeTree.name,
          iconUrl: groupTypeTree.iconUrl,
          types: [],
          groups: [],
        };
        resolvedTypeTree.groups?.push(resolvedGroup);
        await this.resolveTypeTree(groupTypeTree, resolvedGroup);
      }
    }
  }
  indexType(type) {
    type.versions.forEach((version) => {
      this.typeVersionMap.set(version.id, {
        type,
        version,
      });
    });
  }
  async loadGroup(url) {
    var module = await import(url.toString());
    const typeTree = module.default;
    return typeTree;
  }
  async loadType(url) {
    const typeModule = await import(url.toString());
    const type = typeModule.default;
    return type;
  }
}
export { TypeRepository1 as TypeRepository };
function bytesToUuid(bytes) {
  const bits = [
    ...bytes,
  ].map((bit) => {
    const s = bit.toString(16);
    return bit < 16 ? "0" + s : s;
  });
  return [
    ...bits.slice(0, 4),
    "-",
    ...bits.slice(4, 6),
    "-",
    ...bits.slice(6, 8),
    "-",
    ...bits.slice(8, 10),
    "-",
    ...bits.slice(10, 16),
  ].join("");
}
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function validate(id) {
  return UUID_RE.test(id);
}
function generate() {
  const rnds = crypto.getRandomValues(new Uint8Array(16));
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  return bytesToUuid(rnds);
}
const mod = function () {
  return {
    validate: validate,
    generate: generate,
  };
}();
const HEX_CHARS = "0123456789abcdef".split("");
const EXTRA = [
  -2147483648,
  8388608,
  32768,
  128,
];
const SHIFT = [
  24,
  16,
  8,
  0,
];
const blocks = [];
class Sha1 {
  #blocks;
  #block;
  #start;
  #bytes;
  #hBytes;
  #finalized;
  #hashed;
  #h0 = 1732584193;
  #h1 = 4023233417;
  #h2 = 2562383102;
  #h3 = 271733878;
  #h4 = 3285377520;
  #lastByteIndex = 0;
  constructor(sharedMemory1 = false) {
    this.init(sharedMemory1);
  }
  init(sharedMemory) {
    if (sharedMemory) {
      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] =
        blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] =
          blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      this.#blocks = blocks;
    } else {
      this.#blocks = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ];
    }
    this.#h0 = 1732584193;
    this.#h1 = 4023233417;
    this.#h2 = 2562383102;
    this.#h3 = 271733878;
    this.#h4 = 3285377520;
    this.#block = this.#start = this.#bytes = this.#hBytes = 0;
    this.#finalized = this.#hashed = false;
  }
  update(message) {
    if (this.#finalized) {
      return this;
    }
    let msg;
    if (message instanceof ArrayBuffer) {
      msg = new Uint8Array(message);
    } else {
      msg = message;
    }
    let index = 0;
    const length = msg.length;
    const blocks1 = this.#blocks;
    while (index < length) {
      let i;
      if (this.#hashed) {
        this.#hashed = false;
        blocks1[0] = this.#block;
        blocks1[16] = blocks1[1] = blocks1[2] = blocks1[3] = blocks1[4] =
          blocks1[5] = blocks1[6] = blocks1[7] = blocks1[8] = blocks1[9] =
            blocks1[10] = blocks1[11] = blocks1[12] = blocks1[13] =
              blocks1[14] = blocks1[15] = 0;
      }
      if (typeof msg !== "string") {
        for (i = this.#start; index < length && i < 64; ++index) {
          blocks1[i >> 2] |= msg[index] << SHIFT[(i++) & 3];
        }
      } else {
        for (i = this.#start; index < length && i < 64; ++index) {
          let code = msg.charCodeAt(index);
          if (code < 128) {
            blocks1[i >> 2] |= code << SHIFT[(i++) & 3];
          } else if (code < 2048) {
            blocks1[i >> 2] |= (192 | code >> 6) << SHIFT[(i++) & 3];
            blocks1[i >> 2] |= (128 | code & 63) << SHIFT[(i++) & 3];
          } else if (code < 55296 || code >= 57344) {
            blocks1[i >> 2] |= (224 | code >> 12) << SHIFT[(i++) & 3];
            blocks1[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[(i++) & 3];
            blocks1[i >> 2] |= (128 | code & 63) << SHIFT[(i++) & 3];
          } else {
            code = 65536 +
              ((code & 1023) << 10 | msg.charCodeAt(++index) & 1023);
            blocks1[i >> 2] |= (240 | code >> 18) << SHIFT[(i++) & 3];
            blocks1[i >> 2] |= (128 | code >> 12 & 63) << SHIFT[(i++) & 3];
            blocks1[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[(i++) & 3];
            blocks1[i >> 2] |= (128 | code & 63) << SHIFT[(i++) & 3];
          }
        }
      }
      this.#lastByteIndex = i;
      this.#bytes += i - this.#start;
      if (i >= 64) {
        this.#block = blocks1[16];
        this.#start = i - 64;
        this.hash();
        this.#hashed = true;
      } else {
        this.#start = i;
      }
    }
    if (this.#bytes > 4294967295) {
      this.#hBytes += this.#bytes / 4294967296 >>> 0;
      this.#bytes = this.#bytes >>> 0;
    }
    return this;
  }
  finalize() {
    if (this.#finalized) {
      return;
    }
    this.#finalized = true;
    const blocks1 = this.#blocks;
    const i = this.#lastByteIndex;
    blocks1[16] = this.#block;
    blocks1[i >> 2] |= EXTRA[i & 3];
    this.#block = blocks1[16];
    if (i >= 56) {
      if (!this.#hashed) {
        this.hash();
      }
      blocks1[0] = this.#block;
      blocks1[16] = blocks1[1] = blocks1[2] = blocks1[3] = blocks1[4] =
        blocks1[5] = blocks1[6] = blocks1[7] = blocks1[8] = blocks1[9] =
          blocks1[10] = blocks1[11] = blocks1[12] = blocks1[13] = blocks1[14] =
            blocks1[15] = 0;
    }
    blocks1[14] = this.#hBytes << 3 | this.#bytes >>> 29;
    blocks1[15] = this.#bytes << 3;
    this.hash();
  }
  hash() {
    let a = this.#h0;
    let b = this.#h1;
    let c = this.#h2;
    let d = this.#h3;
    let e = this.#h4;
    let f;
    let j;
    let t;
    const blocks1 = this.#blocks;
    for (j = 16; j < 80; ++j) {
      t = blocks1[j - 3] ^ blocks1[j - 8] ^ blocks1[j - 14] ^ blocks1[j - 16];
      blocks1[j] = t << 1 | t >>> 31;
    }
    for (j = 0; j < 20; j += 5) {
      f = b & c | ~b & d;
      t = a << 5 | a >>> 27;
      e = t + f + e + 1518500249 + blocks1[j] >>> 0;
      b = b << 30 | b >>> 2;
      f = a & b | ~a & c;
      t = e << 5 | e >>> 27;
      d = t + f + d + 1518500249 + blocks1[j + 1] >>> 0;
      a = a << 30 | a >>> 2;
      f = e & a | ~e & b;
      t = d << 5 | d >>> 27;
      c = t + f + c + 1518500249 + blocks1[j + 2] >>> 0;
      e = e << 30 | e >>> 2;
      f = d & e | ~d & a;
      t = c << 5 | c >>> 27;
      b = t + f + b + 1518500249 + blocks1[j + 3] >>> 0;
      d = d << 30 | d >>> 2;
      f = c & d | ~c & e;
      t = b << 5 | b >>> 27;
      a = t + f + a + 1518500249 + blocks1[j + 4] >>> 0;
      c = c << 30 | c >>> 2;
    }
    for (; j < 40; j += 5) {
      f = b ^ c ^ d;
      t = a << 5 | a >>> 27;
      e = t + f + e + 1859775393 + blocks1[j] >>> 0;
      b = b << 30 | b >>> 2;
      f = a ^ b ^ c;
      t = e << 5 | e >>> 27;
      d = t + f + d + 1859775393 + blocks1[j + 1] >>> 0;
      a = a << 30 | a >>> 2;
      f = e ^ a ^ b;
      t = d << 5 | d >>> 27;
      c = t + f + c + 1859775393 + blocks1[j + 2] >>> 0;
      e = e << 30 | e >>> 2;
      f = d ^ e ^ a;
      t = c << 5 | c >>> 27;
      b = t + f + b + 1859775393 + blocks1[j + 3] >>> 0;
      d = d << 30 | d >>> 2;
      f = c ^ d ^ e;
      t = b << 5 | b >>> 27;
      a = t + f + a + 1859775393 + blocks1[j + 4] >>> 0;
      c = c << 30 | c >>> 2;
    }
    for (; j < 60; j += 5) {
      f = b & c | b & d | c & d;
      t = a << 5 | a >>> 27;
      e = t + f + e - 1894007588 + blocks1[j] >>> 0;
      b = b << 30 | b >>> 2;
      f = a & b | a & c | b & c;
      t = e << 5 | e >>> 27;
      d = t + f + d - 1894007588 + blocks1[j + 1] >>> 0;
      a = a << 30 | a >>> 2;
      f = e & a | e & b | a & b;
      t = d << 5 | d >>> 27;
      c = t + f + c - 1894007588 + blocks1[j + 2] >>> 0;
      e = e << 30 | e >>> 2;
      f = d & e | d & a | e & a;
      t = c << 5 | c >>> 27;
      b = t + f + b - 1894007588 + blocks1[j + 3] >>> 0;
      d = d << 30 | d >>> 2;
      f = c & d | c & e | d & e;
      t = b << 5 | b >>> 27;
      a = t + f + a - 1894007588 + blocks1[j + 4] >>> 0;
      c = c << 30 | c >>> 2;
    }
    for (; j < 80; j += 5) {
      f = b ^ c ^ d;
      t = a << 5 | a >>> 27;
      e = t + f + e - 899497514 + blocks1[j] >>> 0;
      b = b << 30 | b >>> 2;
      f = a ^ b ^ c;
      t = e << 5 | e >>> 27;
      d = t + f + d - 899497514 + blocks1[j + 1] >>> 0;
      a = a << 30 | a >>> 2;
      f = e ^ a ^ b;
      t = d << 5 | d >>> 27;
      c = t + f + c - 899497514 + blocks1[j + 2] >>> 0;
      e = e << 30 | e >>> 2;
      f = d ^ e ^ a;
      t = c << 5 | c >>> 27;
      b = t + f + b - 899497514 + blocks1[j + 3] >>> 0;
      d = d << 30 | d >>> 2;
      f = c ^ d ^ e;
      t = b << 5 | b >>> 27;
      a = t + f + a - 899497514 + blocks1[j + 4] >>> 0;
      c = c << 30 | c >>> 2;
    }
    this.#h0 = this.#h0 + a >>> 0;
    this.#h1 = this.#h1 + b >>> 0;
    this.#h2 = this.#h2 + c >>> 0;
    this.#h3 = this.#h3 + d >>> 0;
    this.#h4 = this.#h4 + e >>> 0;
  }
  hex() {
    this.finalize();
    const h0 = this.#h0;
    const h1 = this.#h1;
    const h2 = this.#h2;
    const h3 = this.#h3;
    const h4 = this.#h4;
    return HEX_CHARS[h0 >> 28 & 15] + HEX_CHARS[h0 >> 24 & 15] +
      HEX_CHARS[h0 >> 20 & 15] + HEX_CHARS[h0 >> 16 & 15] +
      HEX_CHARS[h0 >> 12 & 15] + HEX_CHARS[h0 >> 8 & 15] +
      HEX_CHARS[h0 >> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h1 >> 28 & 15] +
      HEX_CHARS[h1 >> 24 & 15] + HEX_CHARS[h1 >> 20 & 15] +
      HEX_CHARS[h1 >> 16 & 15] + HEX_CHARS[h1 >> 12 & 15] +
      HEX_CHARS[h1 >> 8 & 15] + HEX_CHARS[h1 >> 4 & 15] + HEX_CHARS[h1 & 15] +
      HEX_CHARS[h2 >> 28 & 15] + HEX_CHARS[h2 >> 24 & 15] +
      HEX_CHARS[h2 >> 20 & 15] + HEX_CHARS[h2 >> 16 & 15] +
      HEX_CHARS[h2 >> 12 & 15] + HEX_CHARS[h2 >> 8 & 15] +
      HEX_CHARS[h2 >> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h3 >> 28 & 15] +
      HEX_CHARS[h3 >> 24 & 15] + HEX_CHARS[h3 >> 20 & 15] +
      HEX_CHARS[h3 >> 16 & 15] + HEX_CHARS[h3 >> 12 & 15] +
      HEX_CHARS[h3 >> 8 & 15] + HEX_CHARS[h3 >> 4 & 15] + HEX_CHARS[h3 & 15] +
      HEX_CHARS[h4 >> 28 & 15] + HEX_CHARS[h4 >> 24 & 15] +
      HEX_CHARS[h4 >> 20 & 15] + HEX_CHARS[h4 >> 16 & 15] +
      HEX_CHARS[h4 >> 12 & 15] + HEX_CHARS[h4 >> 8 & 15] +
      HEX_CHARS[h4 >> 4 & 15] + HEX_CHARS[h4 & 15];
  }
  toString() {
    return this.hex();
  }
  digest() {
    this.finalize();
    const h0 = this.#h0;
    const h1 = this.#h1;
    const h2 = this.#h2;
    const h3 = this.#h3;
    const h4 = this.#h4;
    return [
      h0 >> 24 & 255,
      h0 >> 16 & 255,
      h0 >> 8 & 255,
      h0 & 255,
      h1 >> 24 & 255,
      h1 >> 16 & 255,
      h1 >> 8 & 255,
      h1 & 255,
      h2 >> 24 & 255,
      h2 >> 16 & 255,
      h2 >> 8 & 255,
      h2 & 255,
      h3 >> 24 & 255,
      h3 >> 16 & 255,
      h3 >> 8 & 255,
      h3 & 255,
      h4 >> 24 & 255,
      h4 >> 16 & 255,
      h4 >> 8 & 255,
      h4 & 255,
    ];
  }
  array() {
    return this.digest();
  }
  arrayBuffer() {
    this.finalize();
    const buffer = new ArrayBuffer(20);
    const dataView = new DataView(buffer);
    dataView.setUint32(0, this.#h0);
    dataView.setUint32(4, this.#h1);
    dataView.setUint32(8, this.#h2);
    dataView.setUint32(12, this.#h3);
    dataView.setUint32(16, this.#h4);
    return buffer;
  }
}
class HmacSha1 extends Sha1 {
  #sharedMemory;
  #inner;
  #oKeyPad;
  constructor(secretKey, sharedMemory2 = false) {
    super(sharedMemory2);
    let key;
    if (typeof secretKey === "string") {
      const bytes = [];
      const length = secretKey.length;
      let index = 0;
      for (let i = 0; i < length; i++) {
        let code = secretKey.charCodeAt(i);
        if (code < 128) {
          bytes[index++] = code;
        } else if (code < 2048) {
          bytes[index++] = 192 | code >> 6;
          bytes[index++] = 128 | code & 63;
        } else if (code < 55296 || code >= 57344) {
          bytes[index++] = 224 | code >> 12;
          bytes[index++] = 128 | code >> 6 & 63;
          bytes[index++] = 128 | code & 63;
        } else {
          code = 65536 +
            ((code & 1023) << 10 | secretKey.charCodeAt(++i) & 1023);
          bytes[index++] = 240 | code >> 18;
          bytes[index++] = 128 | code >> 12 & 63;
          bytes[index++] = 128 | code >> 6 & 63;
          bytes[index++] = 128 | code & 63;
        }
      }
      key = bytes;
    } else {
      if (secretKey instanceof ArrayBuffer) {
        key = new Uint8Array(secretKey);
      } else {
        key = secretKey;
      }
    }
    if (key.length > 64) {
      key = new Sha1(true).update(key).array();
    }
    const oKeyPad = [];
    const iKeyPad = [];
    for (let i = 0; i < 64; i++) {
      const b = key[i] || 0;
      oKeyPad[i] = 92 ^ b;
      iKeyPad[i] = 54 ^ b;
    }
    this.update(iKeyPad);
    this.#oKeyPad = oKeyPad;
    this.#inner = true;
    this.#sharedMemory = sharedMemory2;
  }
  finalize() {
    super.finalize();
    if (this.#inner) {
      this.#inner = false;
      const innerHash = this.array();
      super.init(this.#sharedMemory);
      this.update(this.#oKeyPad);
      this.update(innerHash);
      super.finalize();
    }
  }
}
class DenoStdInternalError extends Error {
  constructor(message) {
    super(message);
    this.name = "DenoStdInternalError";
  }
}
const ANSI_PATTERN = new RegExp(
  [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
  ].join("|"),
  "g",
);
var DiffType;
(function (DiffType1) {
  DiffType1["removed"] = "removed";
  DiffType1["common"] = "common";
  DiffType1["added"] = "added";
})(DiffType || (DiffType = {}));
class AssertionError extends Error {
  constructor(message1) {
    super(message1);
    this.name = "AssertionError";
  }
}
class ModelRepository1 {
  modelsById;
  typedModelLoadHook;
  modelsByTypeId;
  modelsOfTypeLoadHook;
  constructor() {
    this.getModelById = this.getModelById.bind(this);
    this.modelsById = new Map();
    this.modelsByTypeId = new Map();
    this.typedModelLoadHook = (tm) => tm;
    this.modelsOfTypeLoadHook = (mot) => mot;
  }
  updateOptions(options) {
    this.typedModelLoadHook = options?.typedModelLoadHook ||
      this.typedModelLoadHook;
    this.modelsOfTypeLoadHook = options?.modelsOfTypeLoadHook ||
      this.modelsOfTypeLoadHook;
  }
  async load(modelsByType) {
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
  }
  async getModelById(id) {
    const model = this.modelsById.get(id);
    if (model === undefined) throw new Error(`model with id: ${id}, not found`);
    return Promise.resolve(model);
  }
  getModelsByTypeId(typeId) {
    return this.modelsByTypeId.get(typeId);
  }
  async upsertModel(model) {
    const currentModel = this.modelsById.get(model.id || "");
    if (currentModel?.typeId === undefined && model.typeId === undefined) {
      throw new Error("typeId missing");
    }
    const typeId = currentModel?.typeId || model.typeId || "";
    const uModel = {
      ...model,
      typeId,
      id: currentModel?.id || mod.generate(),
      name: model.name || currentModel?.name,
    };
    const modelGroup = this.getModelsByTypeId(typeId);
    if (modelGroup === undefined) {
      const modelsOfType = this.modelsOfTypeLoadHook({
        typeId,
        models: [
          uModel,
        ],
      });
      this.modelsByTypeId.set(typeId, modelsOfType);
    } else if (currentModel === undefined) {
      modelGroup.models.push(this.typedModelLoadHook(uModel));
    }
    this.modelsById.set(uModel.id, uModel);
  }
  async deleteModelById(id) {
    this.modelsById.delete(id);
  }
}
export { ModelRepository1 as ModelRepository };
class ViewEngine1 {
  getModel;
  getViewFunction;
  context = {};
  getContext() {
    return this.context;
  }
  setContext(context) {
    this.context = context;
  }
  constructor(getModel, getViewFunction) {
    this.getModel = getModel;
    this.getViewFunction = getViewFunction;
    this.setContext = this.setContext.bind(this);
    this.renderModel = this.renderModel.bind(this);
  }
  async renderModel(modelId, ...args) {
    if (!modelId) throw new Error("modelId is null or empty");
    const model = await this.getModel(modelId);
    const viewFunction = await this.getViewFunction(model.typeId);
    let oldContext = this.context;
    let viewEngine = {
      renderModel: this.renderModel,
      setContext: this.setContext,
    };
    let cntx = {
      ...this.context,
      model,
      viewEngine,
    };
    try {
      return await viewFunction(cntx, ...args);
    } finally {
      this.context = oldContext;
    }
  }
}
export { ViewEngine1 as ViewEngine };
class CompositionRepository1 {
  modelRepository;
  typeRepository;
  constructor(options2) {
    this.modelRepository = options2?.modelRepository || new ModelRepository1();
    this.typeRepository = options2?.typeRepository || new TypeRepository1();
  }
  async load(composition, url) {
    if (composition.types.name === undefined) {
      await this.typeRepository.loadFromUrl(
        new URL(composition.types.toString(), url),
      );
    } else {
      await this.typeRepository.load(composition.types);
    }
    await this.modelRepository.load(composition.modelsByType);
  }
  async loadFromUrl(url) {
    var module = await import(url.toString());
    const composition = module.default;
    await this.load(composition, url);
  }
  get composition() {
    const mot = Array.from(this.modelRepository.modelsByTypeId.values());
    const mbt = mot.map((val) => {
      val.models = val.models.map((m) => {
        return {
          ...m,
          typeId: undefined,
        };
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
export { CompositionRepository1 as CompositionRepository };
class ModelViewEngine1 {
  viewEngine;
  constructor(compositionRepo) {
    const getModel1 = compositionRepo.modelRepository.getModelById;
    const getViewFunction1 = compositionRepo.typeRepository.getViewFunction;
    this.viewEngine = new ViewEngine1(getModel1, getViewFunction1);
  }
  async renderModel(modelId, args) {
    return this.viewEngine.renderModel(modelId, args);
  }
}
export { ModelViewEngine1 as ModelViewEngine };
