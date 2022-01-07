import {
  Close,
  DragIndicator,
  HelpOutline,
  Refresh,
} from "@mui/icons-material";
import { Box, Card, CardContent, CardHeader } from "@mui/material";
import React from "react";

export const NodeContainer: React.FC<{ selected: boolean; name: string, style?: React.CSSProperties }> = ({
  selected,
  name,
  children,
  style
}) => {
  return (
    <>
      <Card
        style={{
          maxWidth: "200px",
          overflow: "visible",
          boxSizing: "content-box",
          borderColor: "#e9e9e9",
          paddingBottom: "0px",
          ...style
        }}
        variant="outlined"
        sx={
          selected
            ? { boxShadow: 2, borderWidth: "2px" }
            : { borderWidth: "2px" }                
        }
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#b7dbff",
            borderBottom: "1px solid #e9e9e9",
          }}
        >
          <DragIndicator className="drag-handle" />
          {/* <Public />  */}
          {/* <div/> */}
          {<Refresh />}
          {/* <AutoAwesomeMotion/> */}
          <HelpOutline />
          <Close />
        </Box>
        <CardHeader
          sx={{
            backgroundColor: "#b7dbff",
            marginBottom: "3px",
            borderBottom: "2px solid #e9e9e9",
            padding: "2px",
            height: "42px",
            paddingLeft: "8px",
            paddingRight: "8px",
            "& .MuiCardHeader-subheader": {},
          }}
          subheader={`${name}`}
        ></CardHeader>
        <CardContent style={{ padding: "0px" }}>{children}</CardContent>
      </Card>
    </>
  );
};
