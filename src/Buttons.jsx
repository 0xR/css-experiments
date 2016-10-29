import React from 'react';
import cn from 'classnames';
import styles from 'basscss-btn';
import primaryStyles from 'basscss-btn-primary';

const makeButton = (defaultClassname) => ({ children, className, ...rest }) => (
  <button className={cn(styles.btn, defaultClassname, className)} {...rest}>{children}</button>
)

export const Button = makeButton();

export const PrimaryButton = makeButton(primaryStyles.btnPrimary);
