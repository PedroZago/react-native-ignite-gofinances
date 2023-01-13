import { TextInput } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';

interface ContainerProps {
  isActive: boolean;
}

export const Container = styled(TextInput)<ContainerProps>`
  width: 100%;
  padding: 16px 18px;

  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};

  color: ${({ theme }) => theme.colors.text_dark};
  background-color: ${({ theme }) => theme.colors.shape};

  border-radius: 5px;
  margin-bottom: 8px;

  ${({ isActive, theme }) =>
    isActive &&
    css`
      border-width: 3px;
      border-color: ${theme.colors.attention};
    `}
`;
