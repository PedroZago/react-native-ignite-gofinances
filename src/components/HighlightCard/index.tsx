import React from 'react';

import { TypeCard } from '../../interfaces';
import {
  Container,
  Header,
  Title,
  Icon,
  Amount,
  LastTransaction,
  Footer,
} from './styles';

export interface HighlightCardProps {
  title: string;
  amount: string;
  lastTransaction: string;
  type: TypeCard;
}

export const HighlightCard: React.FC<HighlightCardProps> = ({
  amount,
  lastTransaction,
  title,
  type,
}) => {
  const icons = {
    income: 'arrow-up-circle',
    expense: 'arrow-down-circle',
    total: 'dollar-sign',
  };

  return (
    <Container type={type}>
      <Header>
        <Title type={type}>{title}</Title>

        <Icon name={icons[type]} type={type} />
      </Header>

      <Footer>
        <Amount type={type}>{amount}</Amount>

        <LastTransaction type={type}>{lastTransaction}</LastTransaction>
      </Footer>
    </Container>
  );
};
