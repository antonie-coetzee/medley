import React from "react";
import { Handle, Position } from "react-flow-renderer";

export const Terminal: React.VFC<{
  id: string;
  output?: boolean;
  style?: React.CSSProperties;
}> = ({ id, output, style }) => {
  return (
    <Handle
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
        backgroundColor: "#0288d1",
        ...style,
      }}
      isConnectable
      id={id}
    ></Handle>
  );
};
