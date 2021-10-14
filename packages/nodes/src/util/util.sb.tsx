import { Story } from "@storybook/react";
import { Medley } from "@medley-js/core";
import React, { FC, Fragment, ReactElement } from "react";

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
