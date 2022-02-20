import "@mui/material/styles"
import { createTheme as muiCreateTheme } from "@mui/material/styles"

declare module "@mui/material/styles" {
  interface Theme {
    composite: {
      link:{
        stroke:string;
        selectedStroke:string;
      }
    };
  }
  interface ThemeOptions {
    composite?: {
      link?:{
        stroke?:string;
        selectedStroke?:string;
      }
    };
  }
}

export const createTheme = () => {
  return muiCreateTheme({
    composite: {
      link: {
        stroke: "blue",
        selectedStroke: "grey"
      }
    }
  });
}