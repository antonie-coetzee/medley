import { Story } from "@storybook/react";
import { Medley } from "@medley-js/core";
import React, { FC, Fragment, ReactElement } from "react";
import { CssBaseline } from "@mui/material";
import { CLoader, CMedleyTypes, constants, CType, TEditNodeComponent, TNodeComponent } from "@medley-js/common";
import { createEmptyCompositeNode } from "@/types/Structure/Composite/stories/utils";
import { CompositeType } from "@/types";

export interface StoryWithLoaders extends Story {
  loaders: [() => Promise<any>];
}

export const componentStory = (
  componentFactory: () => Promise<FC<any>>,
  containerFactory?: () => Promise<FC<any>>
): StoryWithLoaders => {
  const story: StoryWithLoaders = (
    args,
    { loaded: { Component, Container} }
  ) => (
    <Fragment>
      <CssBaseline />
      {Container == null ? (
        <Component {...args} />
      ) : (
        <Container>
          <Component {...args} />
        </Container>
      )}
    </Fragment>
  );

  story.loaders = [
    async () => ({
      Component: await componentFactory(),
      Container: containerFactory && (await containerFactory())
    }),
  ];
  return story;
};

export const nodeStory = (type: CType)=>{
  return componentStory(async () => {
    const medley = new Medley<CMedleyTypes>({loader:new CLoader()});

    medley.types.upsertType(CompositeType);
    medley.types.upsertType(type);

    const ecnContext = createEmptyCompositeNode(medley);

    ecnContext.compositeScope.nodes.insertNodePart({
      name: "node",
      position: [50, 50],
      type: type.name,
    });
  
    const EditNodeComponent = await medley.types.getExport<TEditNodeComponent>(
      CompositeType.name,
      constants.EditNodeComponent
    );

    if(EditNodeComponent == null){
      throw new Error("EditNodeComponent is undefined")
    }

    return () => (
      <EditNodeComponent
        context={ecnContext}
        host={{executeCommand:(cmd)=>cmd.execute()}}
      />
    );
  })
}
