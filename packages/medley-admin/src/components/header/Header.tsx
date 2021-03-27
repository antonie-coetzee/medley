import React, { useRef } from "react";

import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {
  AppBar,
  Button,
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
  const classes = useStyles();
  let uploadRef: React.RefObject<HTMLInputElement> = React.createRef();
  let downloadRef: React.RefObject<HTMLInputElement> = React.createRef();
  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <div className={classes.root}>
            <input
              accept="image/*"
              className={classes.input}
              id="upload-config"
              type="file"
              ref={uploadRef}
            />
            <label htmlFor="upload-config">
              <Button
                variant="contained"
                color="default"
                className={classes.button}
                startIcon={<CloudUploadIcon />}
                onClick={(e) => {
                  uploadRef.current?.click();
                }}
              >
                Upload
              </Button>
            </label>
            <input
              accept="image/*"
              className={classes.input}
              id="download-config"
              type="file"
              ref={downloadRef}
            />
            <label htmlFor="download-config">
              <Button
                variant="contained"
                color="default"
                className={classes.button}
                startIcon={<CloudDownloadIcon />}
                onClick={(e) => {
                    downloadRef.current?.click();
                }}
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
