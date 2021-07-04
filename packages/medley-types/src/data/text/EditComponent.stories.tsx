import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { EditComponent } from './EditComponent';

export default {
  title: 'data/text',
  component: EditComponent,
} as ComponentMeta<typeof EditComponent>;

const Template: ComponentStory<typeof EditComponent> = (args) => <EditComponent {...args} />;

export const Example = Template.bind({});
Example.args = {};