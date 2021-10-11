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
