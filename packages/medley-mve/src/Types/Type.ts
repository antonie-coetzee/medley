export interface ModuleExport {
  url: URL;
  name?: string;
}

export interface TypeVersion {
  number: string;
  id: string;
  viewFunction: ModuleExport;
  editUrl?: URL;
  schema?: {
    input?: URL;
    output?: URL;
  };
  migration?: {
    up: ModuleExport;
    down: ModuleExport;
  };
}

export interface Type {
  name: string;
  iconUrl?: URL;
  versions: TypeVersion[];
}

export interface TypeTree {
  name: string;
  iconUrl?: URL;
  types: (URL | Type)[];
  groups?: (URL | TypeTree)[];
}
