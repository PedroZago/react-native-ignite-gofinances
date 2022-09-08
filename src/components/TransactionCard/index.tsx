import React from 'react';

import { TransactionData } from '../../interfaces';
import { getCategoryData } from '../../utils/categories';
import {
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date,
} from './styles';

interface TransactionCardProps {
  data: TransactionData;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ data }) => {
  return (
    <Container>
      <Title>{data.name}</Title>

      <Amount type={data.type}>
        {data.type === 'expense' && '-'}
        {data.amount}
      </Amount>

      <Footer>
        <Category>
          <Icon name={getCategoryData(data.category).icon} />

          <CategoryName>{getCategoryData(data.category).name}</CategoryName>
        </Category>

        <Date>{data.date}</Date>
      </Footer>
    </Container>
  );
};
