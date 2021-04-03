import React, { useRef } from "react";
import { useStores } from "../../stores/Stores";

import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {
  AppBar,
  Button,
  ButtonGroup,
  createStyles,
  makeStyles,
  Theme,
  Toolbar,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: "none",
    },
    button: {
      margin: theme.spacing(1),
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
      <AppBar position="static">
        <Toolbar>
          <div className={classes.root}>
            <label htmlFor="upload-config">
            <input
              accept="*.json"
              className={classes.input}
              id="upload-config"
              type="file"
              onChange={LoadConfig}
            />
              <Button
                variant="contained"
                color="default"
                className={classes.button}
                component="span"
                startIcon={<CloudUploadIcon />}
              >
                Upload
              </Button>
            </label>
            <input
              accept="*.json"
              className={classes.input}
              id="download-config"
              type="file"
            />
            <label htmlFor="download-config">
              <Button
                variant="contained"
                color="default"
                className={classes.button}
                component="span"
                startIcon={<CloudDownloadIcon />}
              >
                Download
              </Button>
            </label>
          </div>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export const Header = HeaderComponent;
