import React, { FC } from "react";
import Form from "@rjsf/material-ui";
import { valueSchema } from "./valueSchema";
import { EditComponentProps } from "../../types";

export const EditComponent:FC<EditComponentProps> = ({medley, model, registerGetValue}) => {
  return <Form schema={valueSchema} />;
};
