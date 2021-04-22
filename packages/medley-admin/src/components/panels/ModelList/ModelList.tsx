import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { TabNode } from "flexlayout-react";
import { useStores } from "../../../stores/Stores";
import { AppBar, Button, Toolbar } from "@material-ui/core";
import { AddCircleOutline } from "@material-ui/icons";
import { NewModelDialog } from "./NewModelDialog";
import { Observer } from "mobx-react";

const borderStyle = makeStyles({
  table: {
    minWidth: 650,
  },
});

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export function ModelListComponent(node: TabNode) {
  const classes = useStyles();
  const borderClasses = borderStyle();

  const typeVersionId = node.getConfig()?.typeVersionId as string;
  const { modelStore } = useStores();
  const typedModels = modelStore.getModelsByTypeVersionId(typeVersionId);

  const createModel = async (name: string) => {
    if (name) {
      await modelStore.upsertModel({ name: name, typeId: typeVersionId });
    }
  };

  return (
    <Fragment>
      <AppBar position="static" color="transparent">
        <Toolbar variant="dense">
          {NewModelDialog((name) => createModel(name))}
        </Toolbar>
      </AppBar>
      <TableContainer className={borderClasses.table}>
        <Table stickyHeader className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Id</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {typedModels?.typeId &&
              typedModels.models.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}

export function ModelList(node: TabNode) {
  const stores = useStores();
  return (
    <Observer>
      {() => ModelListComponent(node)}
    </Observer>
  );
}
