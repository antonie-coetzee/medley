import { Medley } from "@medley-js/core";
import { Logger, nullLogger } from "../Logger";

export type MedleyContext = {
  key: symbol;
};

declare module "@medley-js/core" {
  interface Medley {
    createContext: <T>(value: T) => MedleyContext;
    setContext: <T>(context: MedleyContext, value: T) => void;
    useContext: <T>(context: MedleyContext) => T | undefined;
    context: { [index: symbol]: unknown };

    logger: Logger;
  }
}

Medley.prototype.context = {};

Medley.prototype.createContext = function <T>(value?: T) {
  const symbol = Symbol();
  this.context[symbol] = value;
  return { key: symbol };
};

Medley.prototype.setContext = function <T>(context: MedleyContext, value: T) {
  this.context[context.key] = value;
};

Medley.prototype.useContext = function <T>(context: MedleyContext) {
  return this.context[context.key] as T | undefined;
};

Medley.prototype.logger = nullLogger;
