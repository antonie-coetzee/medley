import { Cache } from "@medley-js/core";
import { CNodeWithValue } from "@medley-js/common";

export type PropertiesNode = CNodeWithValue<{ 
    summary?: string,
    detail?: string,
    icon?: string,
    cache?: Cache,
    color?: string
}>;