export interface ModuleExport {
  URL: URL;
  name?: string;
}

export interface TypeVersion {
  number: string;
  id: string;
  viewFunction: ModuleExport;
  editUrl?: URL;
  schemaUrl?: URL;
}

export interface Type {
  name: string;
  iconUrl?: URL;
  versions: TypeVersion[];
}
