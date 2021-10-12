export type Events<T> = {
  onLoad: (items: T[]) => void,
  onChange: (items: T[]) => void,
  onItemChange: (item: T) => void,
  onItemAdd: (item: T) => void,
  onItemDelete: (item: T) => void,
}

export enum EventType {
  OnLoad = "OnLoad",
  OnChange = "OnChange",
  OnItemUpdate = "OnItemUpdate",
  OnItemAdd = "OnItemAdd",
  OnItemDelete = "OnItemDelete"
}

export class MEvent<T> extends Event {
  data?: T

  static createCancelable<T>(eventType: EventType, data?:T){
    const e = new MEvent<T>(eventType, {cancelable:true});
    e.data = data;
    return e;
  }

  static create<T>(eventType: EventType, data?:T){
    const e = new MEvent<T>(eventType);
    e.data = data;
    return e;
  }
}
