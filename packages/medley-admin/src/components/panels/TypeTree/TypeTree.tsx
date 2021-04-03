import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { useStores } from "../../../stores/Stores";
// import { Type, TypeMap, TypeMapRepository } from "@medley/medley-mve";
import { Observer, observer } from "mobx-react";

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
});

let nodeId = 0;

const getNodeId = () => {
  return (++nodeId).toString();
}

// const generateTypes = (parent:string, types:(string | Type)[]) => {
//   if(types == null || types.length == 0)
//     return 
  
//   return <Fragment>
//     {types.filter(type => typeof type === "object").map(typeEl => {
//       const type = typeEl as Type;
//       const typeId = parent + "." + type.name;
//       return <TreeItem nodeId={typeId} key={typeId} label={type.name}/>
//     })}
//   </Fragment>
// }

// const generateGroup = (parent:string|null, typeMap:TypeMap) => {
//   if(parent == null || parent === undefined){
//     const groupKey = typeMap.name;
//     return <Fragment>
//       {generateTypes(groupKey, typeMap.types)}
//       {typeMap.groups && typeMap.groups.map(group => generateGroup(groupKey, group))} 
//     </Fragment>
//   }else{
//     const groupKey = parent + "."  + typeMap.name;
//     return <TreeItem nodeId={groupKey} key={groupKey} label={typeMap.name}>
//     {generateTypes(groupKey, typeMap.types)}
//     {typeMap.groups && typeMap.groups.map(group => generateGroup(groupKey, group))}
//   </TreeItem>
//   }
// }

// const generateTree = (typeMap: TypeMap | undefined) => {
//   if (typeMap == undefined) {
//     return;
//   }
//   return (
//     <Fragment>
//       {/* {generateGroup(null, typeMap)} */}
//     </Fragment>
//   );
// };

export function FileSystemNavigator() {
  const { typeStore } = useStores();
  nodeId = 0;
  return (
    <Observer>
      {() => (
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {/* {generateTree(typeStore.typeMapRepository?.typeGraph)} */}
        </TreeView>
      )}
    </Observer>
  );
}
