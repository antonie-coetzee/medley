export enum EventType {
  OnChange = "OnChange",
  OnItemUpdate = "OnItemUpdate",
  OnItemCreate = "OnItemCreate",
  OnItemDelete = "OnItemDelete"
}

export class MedleyEvent<T> extends Event {
  data?: T

  static createCancelable<T>(eventType: EventType, data?:T){
    const e = new MedleyEvent<T>(eventType, {cancelable:true});
    e.data = data;
    return e;
  }

  static create<T>(eventType: EventType, data?:T){
    const e = new MedleyEvent<T>(eventType);
    e.data = data;
    return e;
  }
}
