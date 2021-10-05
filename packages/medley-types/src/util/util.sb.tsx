import { Story } from "@storybook/react";
import { Medley } from "medley";
import React, { ReactElement } from "react";

export interface StoryWithLoaders extends Story {
  loaders: [() => Promise<any>];
}

export const componentStory = (
  componentFactory: () => Promise<ReactElement>
): StoryWithLoaders => {
  const story: StoryWithLoaders = (args, { loaded: { Component } }) => (
    <Component {...args}/>
  );

  story.loaders = [
    async () => ({
      Component: await componentFactory(),
    }),
  ];
  return story;
};
