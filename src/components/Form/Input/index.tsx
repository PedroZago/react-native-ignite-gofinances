import React from 'react';
import { TextInputProps } from 'react-native';

import { Container } from './styles';

interface InputProps extends TextInputProps {}

export const Input: React.FC<InputProps> = ({ ...rest }) => {
  return <Container {...rest} />;
};
