export interface TypeVersion {
    number: string;
    id: string;
    moduleUrl: string;
    export?: string;
    editUrl?: string;
    schemaUrl?: string;
    migrationUrl?: string;
    dependenciesUrl?: string;
  }

export interface Type {
    name: string;
    iconUrl?: string;
    versions: TypeVersion[];
}
