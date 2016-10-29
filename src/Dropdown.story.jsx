import React from 'react';
import { storiesOf } from '@kadira/storybook';
import styles from './Dropdown.css';

const Dropdown = () => (
  <div className={styles.container}>
    <div>Hamburger</div>
  </div>
);
storiesOf('Dropdown', module)
  .add('Default', () => (
    <Dropdown />
  ));

