import React, { Fragment, useState } from "react";

import { DataGrid, GridColDef } from "@material-ui/data-grid";
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
import { NodeChip } from "@/components/util/NodeChip";

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
    renderCell: (params) => {
      return <NodeChip node={params.row["node"]} />;
    },
  },
  { field: "id", headerName: "ID", width: 200 },
];

const NodeListComponent = observer((props: { node: TabNode }) => {
  const classes = useStyles();
  const [selected, setSelected] = useState<string[]>([]);
  const { layoutStore, medley, dialogStore } = useStores();

  const typeName = props.node.getConfig()?.typeName as string;

  const createNode = (name: string) => {
    if (name) {
      medley.upsertTypedNode({ name: name, type: typeName });
    }
  };

  const deleteModels = (nodeIds: string[]) => {
    if (nodeIds) {
      dialogStore.openConfirmDialog({
        okButton: "Delete",
        title: "Confirm delete",
        content: "Sure you want to delete the selected models?",
        onOk: () => {
          nodeIds.forEach((nodeId) => medley.deleteNode(nodeId));
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
              onOk: createNode,
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
          rows={medley.getNodesByType(typeName).map((row) => {
            return {
              name: row.name,
              id: row.id,
              node: row,
            };
          })}
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
            layoutStore.addNodeEdit(row.row["node"]);
          }}
        />
      </div>
    </WithToolBar>
  );
});

const NodeListMemo = React.memo(NodeListComponent, (props, nextProps) => {
  if (
    props.node.getConfig()?.typeName === nextProps.node.getConfig()?.typeName
  ) {
    return true;
  } else {
    return false;
  }
});

export const NodeList = (node: TabNode) => {
  return <NodeListMemo node={node} />;
};
