import React, { useRef } from "react";
import { useStores } from "../../stores/Stores";

import { AddCircle, Category, CloudDownload } from "@material-ui/icons";
import { CloudUpload } from "@material-ui/icons";
import {
  AppBar,
  createStyles,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Composition } from "medley";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
      paddingLeft: "0px",
      paddingRight: "0px",
    },
    header: {
      borderBottom: "solid",
      borderBottomColor: "#f7f7f7",
      borderBottomWidth: "8px",
    },
    toolbar:{
      paddingLeft: "14px"
    },
    title: {
      fontFamily: "'Arima Madurai', cursive",
    }
  })
);

type HeaderProps = {};

export const HeaderComponent: React.FC<HeaderProps> = () => {
  const { compositionStore } = useStores();
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const loadConfig = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e == null || e.target.files == null || e.target.files[0] == null)
      return;
    e.preventDefault();
    setDrawerOpen(false);
    toggleDrawer(false);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e?.target?.result as string;
      if (text == null) return;
      await compositionStore.load(JSON.parse(text));
    };

    reader.readAsText(e.target.files[0]);
  };

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  const list = () => (
    <React.Fragment>
      <List>
        <ListItem button onClick={toggleDrawer(false)} >
          <ListItemIcon><AddCircle /></ListItemIcon>
          <ListItemText primary={"New"} />
          
        </ListItem>
        <ListItem button onClick={toggleDrawer(false)}>
          <ListItemIcon><CloudDownload /></ListItemIcon>
          <ListItemText primary={"Download"} />
        </ListItem>
        <ListItem button component="label" >
          <ListItemIcon><CloudUpload /></ListItemIcon>
          <ListItemText primary={"Upload"} />
          <input accept="*.json" hidden type="file" onChange={loadConfig} />
        </ListItem>                   
      </List>
      <Divider />
      <List>
        <ListItem button onClick={toggleDrawer(false)}>
          <ListItemIcon><Category /></ListItemIcon>
          <ListItemText primary={"Types"} />
        </ListItem>          
      </List>      
      </React.Fragment>
  );

  return (
    <React.Fragment>
      <AppBar
        position="static"
        color={"transparent"}
        elevation={0}
        className={classes.header}
      >
       <Toolbar className={classes.toolbar}>
        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" className={classes.title}>
            Medley
          </Typography>
       </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </React.Fragment>
  );
};
export const Header = HeaderComponent;
