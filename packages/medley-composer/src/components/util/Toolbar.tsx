import React, {
  Children,
} from "react";
import {
  createStyles,
  makeStyles,
  styled,
  Theme,
} from "@material-ui/core/styles";
import { Toolbar } from "@material-ui/core";

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

const EditContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

const EditPanel = styled("div")({
  flex: 1,
  overflowY: "auto",
});

export const ToolBar: React.FC = () => {
  const styles = useToolBarStyles();
  return (
    <Toolbar variant="dense" disableGutters={true} className={styles.toolBar}>
      {Children}
    </Toolbar>
  );
};

export const WithToolBar: React.FC<{actions?:JSX.Element[]}> = (props) => {
  const styles = useToolBarStyles();
  return (<EditContainer>
    <Toolbar variant="dense" disableGutters={true} className={styles.toolBar}>
     {props.actions && props.actions.map((a,i)=><React.Fragment key={i}>{a}</React.Fragment>)}
    </Toolbar>
    <EditPanel>
      {props.children}
    </EditPanel>
  </EditContainer>
  );
};