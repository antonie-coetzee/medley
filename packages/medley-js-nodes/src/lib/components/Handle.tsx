import React from "react";
import { Handle as RfHandle, Position } from "react-flow-renderer";
import { Box } from "@mui/system";

const Label: React.FC<{ justifyRight: boolean }> = ({
  children,
  justifyRight,
}) => {
  return (
    <Box
      sx={{
        height: "20px",
        lineHeight: "20px",
        fontSize: "14px",
        cursor: "default",
        paddingLeft: "4px",
        paddingRight: "4px",
        flex: !justifyRight ? 1 : undefined,
        width: "unset",
        marginLeft: justifyRight ? "auto" : undefined
      }}
    >
      {children}
    </Box>
  );
};

const HandleWrapper: React.FC<{ output: boolean }> = ({ children, output }) => {
  return (
    <div className={"handle"} >
      <Box     
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "center",
          paddingRight: output ? "3px" : undefined,
          paddingLeft: !output ? "3px" : undefined,
          transform: `translate(${output ? "10px" : "-10px"})`,
          width: "calc(100%) + 10px",
        }}
      >
        {children}
      </Box>
    </div>
  );
};

export const Handle: React.VFC<{ id: string; output?: boolean; label?: string, color?: string }> = ({
  id,
  output,
  label,
  color
}) => {
  const handle = (
    <RfHandle
      key={id}
      type={output ? "source" : "target"}
      position={output ? Position.Right : Position.Left}
      style={{
        borderTopLeftRadius: "6px",
        borderBottomLeftRadius: "6px",
        borderBottomRightRadius: "6px",
        borderTopRightRadius: "6px",
        border: "none",
        height: "12px",
        width: "12px",
        backgroundColor: color ?? "#0288d1",
        position: "unset",
        transform: "none",
      }}
      isConnectable
      id={id}
    ></RfHandle>
  );
  const isOutput = output || false;
  const hLabel = label && <Label justifyRight={isOutput} key={id + "label"}>{label}</Label>;
  return (
      <HandleWrapper output={isOutput}>
        {isOutput ?  [hLabel, handle] : [handle, hLabel] }
      </HandleWrapper>
    );
};
