import React, { useRef } from "react";
import { fade, styled } from '@material-ui/core/styles';
import { useStores } from "../../stores/Stores";
import { AddCircle, Category, CloudDownload, Save, Search } from "@material-ui/icons";
import SearchIcon from '@material-ui/icons/Search';
import { CloudUpload } from "@material-ui/icons";
import {
  AppBar,
  Button,
  createStyles,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexGrow: 1,
      "& > *": {
        margin: theme.spacing(1),
      },
      paddingLeft: "0px",
      paddingRight: "0px",
    },
    header: {
      borderBottom: "solid",
      borderBottomColor: "#e9e9e9",
      borderBottomWidth: "3px",
    },
    toolbar:{
      paddingLeft: "16px",
      paddingRight: "16px"
    },
    title: {
      flexGrow: 1,
      fontFamily: "'Arima Madurai', cursive",
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.black, 0.05),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.black, 0.10),
      },
      paddingRight:0,
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  })
);

type HeaderProps = {};

export const HeaderComponent: React.FC<HeaderProps> = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { compositionStore } = useStores();
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const importComposition = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e == null || e.target.files == null || e.target.files[0] == null)
      return;
    e.preventDefault();
    setDrawerOpen(false);
    toggleDrawer(false);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e?.target?.result as string;
      if (text == null) return;
      await compositionStore.import(JSON.parse(text));
      enqueueSnackbar("Composition imported", { variant: "success" });
    };

    reader.readAsText(e.target.files[0]);
  };

  const saveActiveComposition = ()=>{
    compositionStore.saveActiveComposition();
    enqueueSnackbar("Composition saved", { variant: "success" });
    setDrawerOpen(false);
    toggleDrawer(false);
  }

  const exportActiveComposition = ()=>{
    try{
      const composition = compositionStore.getComposition();
      const blob = new Blob([JSON.stringify(composition, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "composition.json";
      a.click();
      a.remove();
    }finally{
      toggleDrawer(false);
    }
  }

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
        <ListItem button component="label" >
          <ListItemIcon><CloudUpload /></ListItemIcon>
          <ListItemText primary={"Import"} />
          <input accept="*.json" hidden type="file" onChange={importComposition} />
        </ListItem>
        <ListItem button onClick={exportActiveComposition}>
          <ListItemIcon><CloudDownload /></ListItemIcon>
          <ListItemText primary={"Export"} />
        </ListItem>
        <ListItem button onClick={saveActiveComposition}>
          <ListItemIcon><Save /></ListItemIcon>
          <ListItemText primary={"Save"} />
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
            <Menu />
          </IconButton>
          <Typography variant="h4" className={classes.title}>
            Medley
          </Typography>   
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>            
       </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </React.Fragment>
  );
};
export const Header = HeaderComponent;


