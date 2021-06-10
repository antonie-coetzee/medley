export interface Platform {
  loadJson?: (url:string)=>Promise<any>,
  systemJsImport?: (url:string)=>Promise<any>
  esmImport?: (url:string)=>Promise<any>
}