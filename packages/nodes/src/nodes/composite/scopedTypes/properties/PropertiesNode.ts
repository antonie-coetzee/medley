import { CNodeWithValue } from "@medley-js/common";

export type PropertiesNode = CNodeWithValue<{ 
    summary?: string,
    detail?: string,
    icon?: string,
    helpUrl?: URL
}>;