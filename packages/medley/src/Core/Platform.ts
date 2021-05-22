export interface Platform {
  loadJson?: (url:string)=>Promise<any>,
  systemJsImport?: (url:string)=>Promise<any>
}