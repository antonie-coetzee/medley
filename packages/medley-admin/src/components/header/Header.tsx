import React, { useRef } from "react";
import { useStores } from "../../stores/Stores";

import notes from "./notes.svg";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {
  AppBar,
  Avatar,
  Button,
  ButtonGroup,
  createStyles,
  Icon,
  makeStyles,
  Theme,
  Toolbar,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  })
);

type HeaderProps = {};

export const HeaderComponent: React.FC<HeaderProps> = () => {
  const { compositionStore } = useStores();
  const classes = useStyles();
  const LoadConfig = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e == null || e.target.files == null || e.target.files[0] == null)
      return;
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e?.target?.result as string;
      if (text == null) return;
      await compositionStore.load(JSON.parse(text));
    };

    reader.readAsText(e.target.files[0]);
  };
  return (
    <React.Fragment>
      <AppBar position="static" color={"transparent"} elevation={3}>
        <Toolbar variant="dense" className={classes.root}>
          <Icon>
            <img src={notes} height={24} width={24} />
          </Icon>
          <ButtonGroup color="default" aria-label="outlined button group">
            <Button
              size="small"
              color="default"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              <input accept="*.json" hidden type="file" onChange={LoadConfig} />
              Upload
            </Button>
            <Button
              size="small"
              color="default"
              component="label"
              startIcon={<CloudDownloadIcon />}
            >
              Download
              <input accept="*.json" hidden type="file" />
            </Button>
          </ButtonGroup>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export const Header = HeaderComponent;
