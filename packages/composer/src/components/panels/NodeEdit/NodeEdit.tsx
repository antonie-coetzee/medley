import React from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  IconButton,
  withStyles,
  Divider,
  TextField,
  InputLabel,
  List,
  ListItem,
  Chip,
} from "@material-ui/core";
import { TabNode } from "flexlayout-react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { WithEditToolbar } from "./WithEditToolbar";
import { FileCopy, Link, Save, Settings } from "@material-ui/icons";
import { WithToolBar } from "@/components/util/Toolbar";
import { useStores } from "@/stores/Stores";
import { NodeLinks } from "./NodeLinks";

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

const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: "0",
    },
  })
)((props: any) => <Tab {...props} />);

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
      {value === index && children}
    </div>
  );
}

const NodeEditComponent: React.FC<{ node: TabNode }> = (props) => {
  const { medley } = useStores();
  const nodeId = props.node.getConfig()?.nodeId as string;
  const node = medley.getNode(nodeId);

  const [value, setValue] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <WithToolBar
      actions={[
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <StyledTab icon={<Settings />} />
          <StyledTab icon={<Link />} />
        </Tabs>,
        <Divider orientation="vertical" flexItem />,
        <IconButton key={"save"}>
          <Save />
        </IconButton>,
        <IconButton key={"copy"}>
          <FileCopy />
        </IconButton>,
      ]}
    >
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        <NodeLinks node={node} />
      </TabPanel>
    </WithToolBar>
  );
};

export const NodeEdit = (node: TabNode) => {
  return <NodeEditComponent node={node} />;
};
