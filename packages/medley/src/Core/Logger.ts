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
  help: LogMethod;
  data: LogMethod;
  info: LogMethod;
  debug: LogMethod;
  prompt: LogMethod;
  http: LogMethod;
  verbose: LogMethod;
  input: LogMethod;
  silly: LogMethod;
  child: (options: object) => Logger;
}

const nullLogMethod: LogMethod = (...args: any[]) => nullLogger;

export const nullLogger: Logger = {
  error: nullLogMethod,
  warn: nullLogMethod,
  help: nullLogMethod,
  data: nullLogMethod,
  info: nullLogMethod,
  debug: nullLogMethod,
  prompt: nullLogMethod,
  http: nullLogMethod,
  verbose: nullLogMethod,
  input: nullLogMethod,
  silly: nullLogMethod,
  child: (options: object = {}) => nullLogger,
};
