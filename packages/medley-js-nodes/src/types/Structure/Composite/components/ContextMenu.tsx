import { Settings, Widgets } from "@mui/icons-material";
import { Box, Grid, Paper, styled, Tab, Tabs, Typography } from "@mui/material";
import Menu from "@mui/material/Menu";
import { observer } from "mobx-react";
import React from "react";
import { useStores } from "../stores";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  minWidth: "100px",
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function TypeTabs() {
  const [value, setValue] = React.useState(1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex'}}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab icon={<Settings />} {...a11yProps(0)} />
        <Tab label="Item Two" {...a11yProps(1)} />
        <Tab label="Item Three" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
      <Grid container spacing={2}>
        <Grid item xs={4} md={4}>
          <Item variant="outlined"><Widgets/></Item>
        </Grid>
        <Grid item xs={4} md={4}>
          <Item variant="outlined"><Widgets/></Item>
        </Grid>
        <Grid item xs={4} md={4}>
          <Item variant="outlined"><Widgets/></Item>
        </Grid>
      </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Grid container spacing={2}>
        <Grid item xs={4} md={4}>
          <Item variant="outlined"><Widgets/></Item>
        </Grid>
        <Grid item xs={4} md={4}>
          <Item variant="outlined"><Widgets/></Item>
        </Grid>
        <Grid item xs={4} md={4}>
          <Item variant="outlined"><Widgets/></Item>
        </Grid>
      </Grid>
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Box>
  );
}

export const ContextMenu: React.VFC = observer(() => {
  const { contextMenuStore: cMS } = useStores();
  return (
    <Menu
      open={cMS.contextMenu !== null}
      onClose={cMS.closeContextMenu}
      anchorReference="anchorPosition"
      anchorPosition={cMS.getPosition()}
    >
      {/* {cMS.menuItems &&
        cMS.menuItems.map((MenuItem, i) => (
          <MenuItem
            key={i}
            close={cMS.closeContextMenu}
            mouseX={cMS.contextMenu?.mouseX}
            mouseY={cMS.contextMenu?.mouseY}
          ></MenuItem>
        ))} */}
        <TypeTabs/>
    </Menu>
  );
});
