import { createStyles, makeStyles, Theme } from "@material-ui/core";
import DefaultForm from "@rjsf/core";
import { withTheme } from "@rjsf/core";
import { Theme as MaterialUITheme } from "@rjsf/material-ui";
import { JSONSchema7 } from "json-schema";
import { observer } from "mobx-react";
import React from "react";
import { useRef } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rsfContainer: {
      padding: "0px 16px 16px 16px",
    },
  })
);

type Schemas = {
  valueSchema: string;
  uiSchema: string;
};

type FormEditProps = {
  schemas: Schemas;
  value: {};
  onSave: (value: {}) => void;
};

const Form = (withTheme(MaterialUITheme) as unknown) as {
  new (): DefaultForm<{}>;
};

export const FormEdit = observer((props: FormEditProps) => {
  const submitRef = useRef<HTMLButtonElement>(null);
  const schema = JSON.parse(props.schemas.valueSchema) as JSONSchema7;
  const ui = JSON.parse(props.schemas.uiSchema || "{}");

  const classes = useStyles();
  return (
    <Form
      className={classes.rsfContainer}
      uiSchema={ui}
      schema={schema}
      formData={props.value}
      onSubmit={(e, nativeEvent) => {
        nativeEvent.preventDefault();
        props.onSave(e.formData);
      }}
    >
      <button type={"submit"} style={{ display: "none" }} ref={submitRef} />
    </Form>
  );
});
