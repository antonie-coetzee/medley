import React, { useRef } from "react";
import { useStores } from "../../stores/Stores";

import notes from "./notes.svg";
import {CloudDownload} from "@material-ui/icons";
import {CloudUpload} from "@material-ui/icons";
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
import { Composition } from "medley";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    header: {
      borderBottom: "solid",
      borderBottomColor: "#f7f7f7",
      borderBottomWidth: "8px"
    }
  })
);

const downloadComposition = (composition: Composition | undefined, name:string) => {
  if(composition === undefined)
    return;
  const a = document.createElement('a');
  const type = name.split(".").pop();
  const compoJson = JSON.stringify(composition,null, 2);
  a.href = URL.createObjectURL( new Blob([compoJson], { type:`text/${type === "txt" ? "plain" : type}` }) );
  a.download = name;
  a.click();
}

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
      <AppBar position="static" color={"transparent"} elevation={0} className={classes.header}>
        <Toolbar variant="dense" className={classes.root}>
          <Icon>
            <img src={notes} height={24} width={24} />
            {/* <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="24" height="24" viewBox="0 0 24 24"
 preserveAspectRatio="xMidYMid meet">
<metadata>
Created by potrace 1.16, written by Peter Selinger 2001-2019
</metadata>
<g
fill="#000000" stroke="none">
<path d="M7870 10835 c-2709 -491 -4969 -900 -5023 -910 l-97 -17 0 -2638 0
-2637 -78 27 c-98 35 -238 66 -364 79 -428 47 -905 -81 -1308 -350 -503 -337
-845 -833 -967 -1408 -25 -117 -27 -144 -28 -366 0 -194 4 -257 18 -330 69
-337 240 -640 476 -842 603 -515 1527 -488 2269 66 504 378 833 944 891 1535
8 75 11 901 11 2627 0 2389 1 2518 18 2523 19 6 3605 706 3615 706 4 0 7 -754
7 -1675 0 -921 -2 -1675 -4 -1675 -3 0 -44 13 -93 29 -303 101 -666 107 -1010
16 -510 -135 -984 -481 -1292 -946 -167 -251 -276 -526 -332 -839 -21 -115
-18 -480 4 -600 42 -220 148 -467 271 -630 83 -111 241 -262 348 -333 157
-105 352 -186 547 -228 124 -27 417 -37 558 -20 618 76 1217 461 1576 1012
166 254 270 522 328 839 9 49 14 722 18 2649 l6 2584 1805 353 c993 194 1813
353 1823 354 16 0 17 -86 17 -1666 0 -1582 -1 -1666 -17 -1661 -262 85 -357
101 -598 101 -151 0 -215 -5 -311 -22 -333 -60 -637 -194 -923 -406 -124 -93
-361 -326 -448 -442 -379 -502 -528 -1094 -412 -1632 64 -295 217 -567 431
-767 553 -515 1456 -534 2189 -45 141 93 225 161 352 288 320 316 528 689 626
1122 l26 115 2 3000 c2 1650 2 3214 1 3476 l-3 476 -4925 -892z"/>
</g>
</svg> */}
          </Icon>
          <ButtonGroup color="default" aria-label="outlined button group">
            <Button
              size="small"
              color="default"
              component="label"
              startIcon={<CloudUpload />}
            >
              <input accept="*.json" hidden type="file" onChange={LoadConfig} />
              Upload
            </Button>
            <Button
              size="small"
              color="default"
              startIcon={<CloudDownload />}
              onClick={()=>{downloadComposition(compositionStore.getComposition(), "composition.json")}}             
            >
              Download
            </Button>
          </ButtonGroup>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export const Header = HeaderComponent;
