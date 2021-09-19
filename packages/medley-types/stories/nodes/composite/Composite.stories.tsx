import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { getEditComponent } from '../../../src/composite';

const EditComponent = getEditComponent();

export default {
  title: 'Nodes/Composite',
  component: EditComponent
} as ComponentMeta<typeof EditComponent>;

const Template: ComponentStory<typeof EditComponent> = (args) => <EditComponent {...args} />;

export const Primary = Template.bind({});