import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Button, PrimaryButton } from './Buttons';

storiesOf('Buttons', module)
  .add('Default', () => (
    <Button>Default</Button>
  ))
  .add('Primary', () => (
    <PrimaryButton>Primary</PrimaryButton>
  ));
