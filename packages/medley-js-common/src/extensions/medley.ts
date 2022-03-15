import { Medley } from "@medley-js/core";
import { Logger, nullLogger } from "../Logger";

export type MedleyContext = {
  key: symbol;
};

declare module "@medley-js/core" {
  interface Medley {
    createContext: <T>(key?: symbol, value?: T) => MedleyContext;
    setContext: <T>(context: MedleyContext, value: T) => void;
    useContext: <T>(context: MedleyContext) => T | undefined;
    context: { [index: symbol]: unknown };

    logger: Logger;
  }
}

Medley.prototype.context = {};

Medley.prototype.createContext = function <T>(value?: T) {
  const contextKey = Symbol();
  ensureContext(this);
  this.context[contextKey] = value;
  return { key: contextKey };
};

Medley.prototype.setContext = function <T>(context: MedleyContext, value: T) {
  ensureContext(this);
  this.context[context.key] = value;
};

Medley.prototype.useContext = function <T>(context: MedleyContext) {
  ensureContext(this);
  return this.context[context.key] as T | undefined;
};

Medley.prototype.logger = nullLogger;

function ensureContext(instance: Medley){
  if(instance.context == null){
    instance.context = {};
  }
}
