import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { TabNode } from 'flexlayout-react';
import { useStores } from '../../../stores/Stores';

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

export default function BasicTable(node: TabNode) {
  const classes = useStyles();
  const borderClasses = borderStyle();

  const typeVersionId = node.getConfig()?.typeVersionId as string;
  const {modelStore} = useStores();
  const typedModels = modelStore.getModelsByTypeVersionId(typeVersionId);

  return (
    <TableContainer className={borderClasses.table}>
      <Table stickyHeader  className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Id</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {typedModels?.typeId && typedModels.models.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell >{row.id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
