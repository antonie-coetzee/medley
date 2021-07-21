import DefaultForm from "@rjsf/core";
import { withTheme } from "@rjsf/core";
import { Theme as MaterialUITheme } from "@rjsf/material-ui";
import { JSONSchema7 } from "json-schema";
import { TabNode } from "flexlayout-react";
import { Observer } from "mobx-react";
import React, { useEffect, useState, FC } from "react";
import { useStores } from "../../../stores/Stores";
import { stringifyKey } from "mobx/dist/internal";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rsfContainer: {
      padding:"0px 16px 16px 16px"
    },
    editComponentContainer: {
      padding:"10px 16px 10px 16px"
    }
  })
);

const Form = (withTheme(MaterialUITheme) as unknown) as {
  new (): DefaultForm<{}>;
};

function ModelEditComponent(props:{node:TabNode}) {
  const [schemas, setSchemas] = useState<{valueSchema:string|null, uiSchema:string|null}>({valueSchema:null,uiSchema:null});
  const [EditComponent, setEditComponent] = useState<React.FC>();
  const { modelStore, typeStore } = useStores();
  const classes = useStyles();
  const modelId = props.node.getConfig()?.modelId as string;
  const model = modelStore.getModelById(modelId);

  let myForm: DefaultForm<{}> | null = null;

  useEffect(() => {
    (async () => {
      const EditComponent = await typeStore.getEditComponent(model.typeName);
      if (EditComponent == null) {
        const valueSchema = await typeStore.getValueSchema(model.typeName);
        const uiSchema = await typeStore.getUiSchema(model.typeName);
        setSchemas({valueSchema,uiSchema});
      } else {      
        setEditComponent(EditComponent);
      }
    })();
  }, []);

  if (schemas.valueSchema) {
    const schema = JSON.parse(schemas.valueSchema) as JSONSchema7;
    const ui = JSON.parse(schemas.uiSchema || "{}");
    return (
      <Observer>
        {() => {
          const model = modelStore.getModelById(modelId);
          return (
            <Form className={classes.rsfContainer}
              uiSchema={ui}
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
    return <div className={classes.editComponentContainer}>
      {EditComponent}
      </div>;
  {
    return <div>Value schema not defined...</div>;
  }
}

const ModelEditMemo =  React.memo(ModelEditComponent, (props, nextProps)=>{
  if(props.node.getConfig()?.modelId === nextProps.node.getConfig()?.modelId){
    return true;
  }else{
    return false;
  }
})

export const ModelEdit = (node: TabNode) => {
  return <ModelEditMemo node={node} />
}
