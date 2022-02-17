import { Box, SxProps } from "@mui/system";
import { observer } from "mobx-react";
import React from "react";
import { Handle as RfHandle, Position } from "react-flow-renderer";

const Label: React.FC<{ justifyRight: boolean; labelStyle?: SxProps }> = ({
  children,
  justifyRight,
  labelStyle,
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
        marginLeft: justifyRight ? "auto" : undefined,
        ...labelStyle,
      }}
    >
      {children}
    </Box>
  );
};

const HandleWrapper: React.FC<{ output: boolean; containerStyle?: SxProps; }> = ({
  children,
  output,
  containerStyle,
}) => {
  return (
    <div className={"handle"}>
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
          ...containerStyle,
        }}
      >
        {children}
      </Box>
    </div>
  );
};

export const Handle: React.VFC<{
  portId: string;
  output?: boolean;
  label?: string;
  color?: string;
  containerStyle?: SxProps;
  handleStyle?: React.CSSProperties;
  labelStyle?: SxProps;
}> = observer(({ portId, output, label, color, containerStyle, handleStyle, labelStyle }) => {
  const handle = (
    <RfHandle
      key={portId}
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
        ...handleStyle
      }}
      isConnectable
      id={portId}
    ></RfHandle>
  );
  const isOutput = output || false;
  const hLabel = label && (
    <Label justifyRight={isOutput} key={portId + "label"} labelStyle={labelStyle}>
      {label}
    </Label>
  );
  return (
    <>
      {label == null ? (
        handle
      ) : (
        <HandleWrapper output={isOutput} containerStyle={containerStyle}>
          {isOutput ? [hLabel, handle] : [handle, hLabel]}
        </HandleWrapper>
      )}
    </>
  );
});
