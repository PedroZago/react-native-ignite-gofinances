import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import { Container, Icon, Title } from './styles';

interface TransactionTypeButtonProps extends TouchableOpacityProps {
  title: string;
  type: 'income' | 'expense';
  isActive: boolean;
}

export const TransactionTypeButton: React.FC<TransactionTypeButtonProps> = ({
  title,
  type,
  isActive,
  ...rest
}) => {
  const icons = {
    income: 'arrow-up-circle',
    expense: 'arrow-down-circle',
  };

  return (
    <Container isActive={isActive} type={type} {...rest}>
      <Icon name={icons[type]} type={type} />

      <Title>{title}</Title>
    </Container>
  );
};
