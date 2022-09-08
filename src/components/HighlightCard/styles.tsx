import { Feather } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';

import { TypeCard } from '../../interfaces';

interface IconProps {
  type: TypeCard;
}

interface ContainerProps {
  type: TypeCard;
}

interface TitleProps {
  type: TypeCard;
}

interface AmountProps {
  type: TypeCard;
}

interface LastTransactionProps {
  type: TypeCard;
}

export const Container = styled(View)<ContainerProps>`
  background-color: ${({ theme, type }) =>
    type === 'total' ? theme.colors.secondary : theme.colors.shape};

  width: ${RFValue(300)}px;
  border-radius: 5px;

  padding: 19px 23px;
  padding-bottom: ${RFValue(42)}px;
  margin-right: 16px;
`;

export const Header = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

export const Title = styled(Text)<TitleProps>`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;

  color: ${({ theme, type }) =>
    type === 'total' ? theme.colors.shape : theme.colors.text_dark};
`;

export const Icon = styled(Feather)<IconProps>`
  font-size: ${RFValue(40)}px;

  ${({ type }) =>
    type === 'income' &&
    css`
      color: ${({ theme }) => theme.colors.success};
    `};

  ${({ type }) =>
    type === 'expense' &&
    css`
      color: ${({ theme }) => theme.colors.attention};
    `};

  ${({ type }) =>
    type === 'total' &&
    css`
      color: ${({ theme }) => theme.colors.shape};
    `};
`;

export const Footer = styled(View)``;

export const Amount = styled(Text)<AmountProps>`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(32)}px;

  color: ${({ theme, type }) =>
    type === 'total' ? theme.colors.shape : theme.colors.text_dark};

  margin-top: 38px;
`;

export const LastTransaction = styled(Text)<LastTransactionProps>`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(12)}px;

  color: ${({ theme, type }) =>
    type === 'total' ? theme.colors.shape : theme.colors.text};
`;
