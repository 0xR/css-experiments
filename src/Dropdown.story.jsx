import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Dropdown from './Dropdown';

storiesOf('Dropdown', module)
  .add('Collapsed', () => (
    <Dropdown />
  ))
  .add('Expanded', () => (
    <Dropdown expanded />
  ));

