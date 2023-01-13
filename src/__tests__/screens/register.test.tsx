import * as mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { render, act, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from 'styled-components/native';

import theme from '../../global/styles/theme';
import { Register } from '../../screens/Register';

interface ProviderProps {
  children: React.ReactNode;
}

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({ navigate: jest.fn() }),
  };
});
jest.useFakeTimers();

const Providers: React.FC<ProviderProps> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

describe('Register', () => {
  it('should be open category modal when user click on the category button', () => {
    const { getByTestId } = render(<Register />, { wrapper: Providers });

    const categoryModal = getByTestId('modal-category');
    const categoryModalButton = getByTestId('modal-category-button');

    expect(categoryModal.props.visible).toBeFalsy();

    act(() => fireEvent.press(categoryModalButton));

    jest.advanceTimersByTime(1000);

    expect(categoryModal.props.visible).toBeTruthy();
  });
});
