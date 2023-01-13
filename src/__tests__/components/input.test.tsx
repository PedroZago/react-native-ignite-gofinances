import { render } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from 'styled-components/native';

import { Input } from '../../components/Form/Input';
import theme from '../../global/styles/theme';

interface ProviderProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProviderProps> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

describe('Input Component', () => {
  it('should be render specific border color when is active', () => {
    const { getByTestId, debug } = render(
      <Input
        testID="input-email"
        placeholder="E-mail"
        keyboardType="email-address"
        autoCorrect={false}
        isActive={true}
      />,
      { wrapper: Providers }
    );

    debug();

    const input = getByTestId('input-email');
    expect(input.props.style[0].borderColor).toEqual('#E83F5B');
    expect(input.props.style[0].borderWidth).toEqual(3);
  });
});
