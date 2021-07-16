import { withTheme } from '@rjsf/core';
import { Theme as MaterialUITheme } from '@rjsf/material-ui';
import { JSONSchema7 } from "json-schema";
import { TabNode } from "flexlayout-react";
import { Observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { useStores } from "../../../stores/Stores";

const Form = withTheme(MaterialUITheme);

export function ModelEdit(node: TabNode) {
  const [valueSchema, setValueSchema] = useState("");
  const { modelStore, typeStore } = useStores();
  const modelId = node.getConfig()?.modelId as string;
  const model = modelStore.getModelById(modelId);

  useEffect(() => {
    (async () => {
      const valueSchema = await typeStore.getValueSchema(model.typeName);
      if (valueSchema) {
        setValueSchema(valueSchema);
      }
    })();
  }, []);

  if (valueSchema) {
    const schema = JSON.parse(valueSchema) as JSONSchema7;
    return (
      <Observer>
        {() => {
          const model = modelStore.getModelById(modelId);
          return <Form
            schema={schema}
            formData={model.value}
            onSubmit={(e) => { 
              modelStore.upsertModel({id:model.id, typeName: model.typeName, value:e.formData});
            }}
          />
  }}
      </Observer>
    );
  } else {
    return <div>Value schema not defined...</div>;
  }
}
