import { Story } from "@storybook/react";
import React, { FC, Fragment } from "react";
import { CssBaseline } from "@mui/material";

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
