import { Link, Type, Node } from "../core";
import { NodeFunction } from "../NodeFunction";
import { TypeRepo } from "../repos";

export class TypesApi<TType extends Type = Type>
  implements Omit<TypeRepo, "deleteType" | "newChild">
{
  constructor(private typeRepo: TypeRepo) {}

  public load(types: TType[], baseUrl: URL): void {
    this.typeRepo.load(types, baseUrl);
  }

  public async getNodeFunction<
  TNode extends Node = Node,
  TType extends Type = Type,
  TLink extends Link = Link
  >(typeName: string): Promise<NodeFunction<{}, TNode,TType,TLink>> {
    return this.typeRepo.getNodeFunction<TNode,TType,TLink>(typeName);
  }

  public async getExportFunction<T extends Function = Function>(
    typeName: string,
    functionName?: string
  ) {
    return this.typeRepo.getExportFunction<T>(typeName, functionName);
  }

  public async getExport(typeName: string, name: string = "default") {
    return this.typeRepo.getExport(typeName, name);
  }

  public getTypes(): TType[] {
    return this.typeRepo.getTypes() as TType[];
  }

  public getType(typeName: string): TType {
    return this.typeRepo.getType(typeName) as TType;
  }

  public hasType(typeName: string): boolean {
    return this.typeRepo.hasType(typeName);
  }

  public addType(type: TType) {
    return this.typeRepo.addType(type);
  }
}
