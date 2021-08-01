import React, { Fragment, useState } from "react";

import {
  DataGrid,
  GridColDef,
} from "@material-ui/data-grid";
import { TabNode } from "flexlayout-react";
import { useStores } from "../../../stores/Stores";
import { observer } from "mobx-react";
import {
  createGenerateClassName,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import { WithToolBar } from "../../util/Toolbar";
import { AddBox, Delete } from "@material-ui/icons";

const useStyles = makeStyles({
  table: {
    border: 0,
  },
  tableContainer: {
    height: "100%",
    width: "100%",
  },
});

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    editable: false,
  },
  { field: "id", headerName: "ID", width: 200 },
];

const ModelListComponent = observer((props: { node: TabNode }) => {
  const classes = useStyles();
  const [selected, setSelected] = useState<string[]>([]);
  const { layoutStore, modelStore, dialogStore } = useStores();

  const typeName = props.node.getConfig()?.typeName as string;
  const modelMap = modelStore.nodeMap;

  const createModel = (name: string) => {
    if (name) {
      modelStore.upsertNode({ name: name, type: typeName });
    }
  };

  const deleteModels = (modelIds: string[]) => {
    if (modelIds) {
      dialogStore.openConfirmDialog({
        okButton: "Delete",
        title: "Confirm delete",
        content: "Sure you want to delete the selected models?",
        onOk: () => {
          const res = modelStore.deleteNodes(modelIds);
          // if (res) {
          // } else {
          // }
        },
      });
    }
  };

  return (
    <WithToolBar
      actions={[
        <IconButton
          key={"create"}
          onClick={() => {
            dialogStore.openStringDialog({
              inputLabel: "Name",
              title: "New Model",
              okButton: "Create",
              successMessage: "New model created successfully",
              onOk: createModel,
            });
          }}
        >
          <AddBox />
        </IconButton>,
        <IconButton
          key={"delete"}
          disabled={!(selected && selected.length > 0)}
          onClick={() => {
            deleteModels(selected);
          }}
        >
          <Delete />
        </IconButton>,
      ]}
    >
      <div className={classes.tableContainer}>
        <DataGrid
          rows={Array.from(modelStore.nodeMap.values()).filter(n=>n.type === typeName)?.map((row) => {
            return {       
              name: row.name,
              id: row.id,
              model: row,
            };
          }) || []}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
          className={classes.table}
          onSelectionModelChange={(selection) => {
            if (selection) {
              setSelected(selection.map((el) => el.toString()));
            }
          }}
          onRowDoubleClick={(row, e) => {
            e.preventDefault();
            layoutStore.addNodeEdit(row.row["model"]);
          }}
        />
      </div>
    </WithToolBar>
  );
});

const ModelListMemo = React.memo(ModelListComponent, (props, nextProps) => {
  if (
    props.node.getConfig()?.typeName === nextProps.node.getConfig()?.typeName
  ) {
    return true;
  } else {
    return false;
  }
});

export const ModelList = (node: TabNode) => {
  return <ModelListMemo node={node} />;
};
