type LogCallback = (
  error?: any,
  level?: string,
  message?: string,
  meta?: any
) => void;

export interface LogMethod {
  (message: string, callback: LogCallback): Logger;
  (message: string, meta: any, callback: LogCallback): Logger;
  (message: string, ...meta: any[]): Logger;
  (message: any): Logger;
  (infoObject: object): Logger;
}

export interface Logger {
  error: LogMethod;
  warn: LogMethod;
  info: LogMethod;
  debug: LogMethod;
  child: (options: object) => Logger;
}

const nullLogMethod: LogMethod = (...args: any[]) => nullLogger;

export const nullLogger: Logger = {
  error: nullLogMethod,
  warn: nullLogMethod,
  info: nullLogMethod,
  debug: nullLogMethod,
  child: (options: object = {}) => nullLogger,
};