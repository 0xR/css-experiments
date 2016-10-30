import React from 'react';
import styles from './Buttons.css';
import cn from 'classnames';

function makeComponentWithDefaultClassname(tag, defaultClassName) {
  return ({ className, ...rest }) => React.createElement(tag, {
    className: cn(defaultClassName, className),
    ...rest
  });
}

function makeButton(className) {
  return makeComponentWithDefaultClassname('button', className);
}
export const Button = makeButton(styles['button']);

export const PrimaryButton = makeButton(styles['primary']);
