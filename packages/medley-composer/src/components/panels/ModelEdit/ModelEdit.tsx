import Form from "@rjsf/material-ui";
import { JSONSchema7 } from "json-schema";
import { TabNode } from "flexlayout-react";
import { Observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { useStores } from "../../../stores/Stores";

export function ModelEdit(node: TabNode) {
  const [valueSchema, setValueSchema] = useState("");
  const { modelStore, typeStore } = useStores();
  const modelId = node.getConfig()?.modelId as string;
  const model = modelStore.getModelById(modelId);
  

  useEffect(() => {
    (async () => {
      const valueSchema = await typeStore.getValueSchema(model.typeId);
      if (valueSchema) {
        setValueSchema(valueSchema);
      }
    })();
  }, []);

  if (valueSchema) {
    const schema = JSON.parse(valueSchema) as JSONSchema7;
    return (
      <Observer>
        {() => (
          <Form
            schema={schema}
            formData={model.value}
            onChange={(e) => model.value = e.formData}
          />
        )}
      </Observer>
    );
  } else {
    return <div>Value schema not defined...</div>;
  }
}
