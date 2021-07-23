import DefaultForm from "@rjsf/core";
import { withTheme } from "@rjsf/core";
import { Theme as MaterialUITheme } from "@rjsf/material-ui";
import { JSONSchema7 } from "json-schema";
import { TabNode } from "flexlayout-react";
import { Observer } from "mobx-react";
import React, {
  useEffect,
  useState,
  useRef,
} from "react";
import { useSnackbar } from "notistack";
import { useStores } from "../../../stores/Stores";
import {
  createStyles,
  makeStyles,
  styled,
  Theme,
} from "@material-ui/core/styles";
import { IconButton, Toolbar } from "@material-ui/core";
import { FileCopy, Save } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rsfContainer: {
      padding: "0px 16px 16px 16px",
    },
    editComponentContainer: {
      padding: "10px 16px 10px 16px",
    },
  })
);

const Form = (withTheme(MaterialUITheme) as unknown) as {
  new (): DefaultForm<{}>;
};

const useToolBarStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolBar: {
      backgroundColor: "#e9e9e9",
      flex: 0,
      boxShadow: theme.shadows[1],
      zIndex: 5,
      marginBottom: "2px",
      borderRight: "1px solid #0000002b",
    },
  })
);

const ToolBar: React.FC<{ doSave?: () => void; doCopy?: () => void }> = (
  props
) => {
  const styles = useToolBarStyles();
  return (
    <Toolbar variant="dense" disableGutters={true} className={styles.toolBar}>
      <IconButton
        onClick={() => {
          if (props.doSave) {
            props.doSave();
          }
        }}
      >
        <Save />
      </IconButton>
      <IconButton
        onClick={() => {
          if (props.doCopy) {
            props.doCopy();
          }
        }}
      >
        <FileCopy />
      </IconButton>
    </Toolbar>
  );
};

const EditContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

const EditPanel = styled("div")({
  flex: 1,
  overflowY: "auto",
});

function ModelEditComponent(props: { node: TabNode }) {
  const [schemas, setSchemas] = useState<{
    valueSchema: string | null;
    uiSchema: string | null;
  }>({ valueSchema: null, uiSchema: null });
  const { enqueueSnackbar } = useSnackbar();
  const [EditComponent, setEditComponent] = useState<React.FC>();
  const { modelStore, typeStore, dialogStore } = useStores();
  const classes = useStyles();
  const modelId = props.node.getConfig()?.modelId as string;
  const model = modelStore.getModelById(modelId);
  const submitRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    (async () => {
      const EditComponent = await typeStore.getEditComponent(model.typeName);
      if (EditComponent == null) {
        const valueSchema = await typeStore.getValueSchema(model.typeName);
        const uiSchema = await typeStore.getUiSchema(model.typeName);
        setSchemas({ valueSchema, uiSchema });
      } else {
        setEditComponent(EditComponent);
      }
    })();
  }, []);
  const doSave = () => {
    if (submitRef.current) {
      submitRef.current.click();
    }
  };

  if (schemas.valueSchema) {
    const schema = JSON.parse(schemas.valueSchema) as JSONSchema7;
    const ui = JSON.parse(schemas.uiSchema || "{}");
    return (
      <Observer>
        {() => {
          const model = modelStore.getModelById(modelId);
          const doCopy = () => {
            dialogStore.openStringDialog({
              title: `Copy ${model.name}`,
              inputLabel: "New name",
              successMessage: `Copy successful`,
              onOk: (name) => {
                modelStore.copyModel(name, model);
              },
            });
          };
          return (
            <EditContainer>
              <ToolBar doSave={doSave} doCopy={doCopy} />
              <EditPanel>
                <Form
                  className={classes.rsfContainer}
                  uiSchema={ui}
                  schema={schema}
                  formData={model.value}
                  onSubmit={(e, nativeEvent) => {
                    nativeEvent.preventDefault();
                    modelStore.upsertModel({
                      id: model.id,
                      typeName: model.typeName,
                      value: e.formData,
                    });
                    enqueueSnackbar("Save successful",  { variant: "success" });
                  }}
                >
                  <button
                    type={"submit"}
                    style={{ display: "none" }}
                    ref={submitRef}
                  />
                </Form>
                );
              </EditPanel>
            </EditContainer>
          );
        }}
      </Observer>
    );
  } else if (EditComponent)
    return (
      <React.Fragment>
        <ToolBar />
        <div className={classes.editComponentContainer}>{EditComponent}</div>
      </React.Fragment>
    );
  {
    return null;
  }
}

const ModelEditMemo = React.memo(ModelEditComponent, (props, nextProps) => {
  if (props.node.getConfig()?.modelId === nextProps.node.getConfig()?.modelId) {
    return true;
  } else {
    return false;
  }
});

export const ModelEdit = (node: TabNode) => {
  return <ModelEditMemo node={node} />;
};