import DefaultForm from "@rjsf/core";
import { withTheme } from "@rjsf/core";
import { Theme as MaterialUITheme } from "@rjsf/material-ui";
import { JSONSchema7 } from "json-schema";
import { TabNode } from "flexlayout-react";
import { Observer } from "mobx-react";
import React, { useEffect, useState, FC } from "react";
import { useStores } from "../../../stores/Stores";
import {
  createGenerateClassName,
  createMuiTheme,
  StylesProvider,
  ThemeProvider,
} from "@material-ui/core/styles";

const Form = (withTheme(MaterialUITheme) as unknown) as {
  new (): DefaultForm<{}>;
};

export function ModelEdit(node: TabNode) {
  const [valueSchema, setValueSchema] = useState("");
  const [EditComponent, setEditComponent] = useState<React.FC>();
  const { modelStore, typeStore } = useStores();
  const modelId = node.getConfig()?.modelId as string;
  const model = modelStore.getModelById(modelId);

  let myForm: DefaultForm<{}> | null = null;

  useEffect(() => {
    (async () => {
      const EditComponent = await typeStore.getEditComponent(model.typeName);
      if (EditComponent == null) {
        const valueSchema = await typeStore.getValueSchema(model.typeName);
        if (valueSchema) {
          //setValueSchema(valueSchema);
        }
      } else {
        setEditComponent(EditComponent);
      }
    })();
  }, []);

  if (valueSchema) {
    const schema = JSON.parse(valueSchema) as JSONSchema7;
    return (
      <Observer>
        {() => {
          const model = modelStore.getModelById(modelId);
          return (
            <Form
              schema={schema}
              formData={model.value}
              ref={(ref) => (myForm = ref)}
              onSubmit={(e) => {
                modelStore.upsertModel({
                  id: model.id,
                  typeName: model.typeName,
                  value: e.formData,
                });
              }}
            />
          );
        }}
      </Observer>
    );
  } else if (EditComponent)
    return <React.Fragment>{EditComponent}</React.Fragment>;
  {
    return <div>Value schema not defined...</div>;
  }
}
