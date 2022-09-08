import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import { Category, Container, Icon } from './styles';

interface CategorySelectButtonProps extends TouchableOpacityProps {
  title: string;
}

export const CategorySelectButton: React.FC<CategorySelectButtonProps> = ({
  title,
  ...rest
}) => {
  return (
    <Container {...rest}>
      <Category>{title}</Category>

      <Icon name="chevron-down" />
    </Container>
  );
};
