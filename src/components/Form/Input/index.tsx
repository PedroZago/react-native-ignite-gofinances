import React from 'react';
import { TextInputProps } from 'react-native';

import { Container } from './styles';

interface InputProps extends TextInputProps {
  isActive?: boolean;
}

export const Input: React.FC<InputProps> = ({ isActive = false, ...rest }) => {
  return <Container isActive={isActive} {...rest} />;
};
