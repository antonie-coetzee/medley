import React from "react";
import {Paper, Tabs, Tab} from "@material-ui/core";
import { TabNode } from "flexlayout-react";
import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { NodeValueToolbar } from "@/components/panels/NodeEdit/NodeValue/NodeValueToolbar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabs: {
      backgroundColor: "#e9e9e9",
      flex: 0,
      boxShadow: theme.shadows[1],
      zIndex: 5,
      marginBottom: "2px",
      borderRight: "1px solid #0000002b",
    },
  })
);

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
       children
      )}
    </div>
  );
}

function NodeEditComponent() {
  const [value, setValue] = React.useState(1);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>

        <Tabs
          value={value}
          onChange={handleChange}
        >
          <Tab label="Config" />
          <Tab label="Links" />
        </Tabs>

      {/* <TabPanel value={value} index={0}>
        <NodeValueToolbar/>
      </TabPanel> */}
    </React.Fragment>
  );
}

export const NodeEdit = (node: TabNode) => {
  return <NodeEditComponent />;
};
