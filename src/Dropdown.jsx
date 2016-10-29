import React, { PropTypes } from 'react';
import styles from './Dropdown.css';
import { Button, PrimaryButton } from './Buttons';

const Dropdown = ({ expanded }) => (
  <div className={styles.container}>
    <PrimaryButton>Button</PrimaryButton>
    { expanded &&
      (<div className={styles.dropdown}>
        <Button className={styles.action}>Dropdown Action</Button>
        <Button className={styles.action}>Action</Button>
      </div>)
    }
  </div>
);

Dropdown.propTypes = {
  expanded: PropTypes.bool,
};

export default Dropdown;
