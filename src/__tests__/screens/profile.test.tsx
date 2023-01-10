import { render } from '@testing-library/react-native';
import React from 'react';

import { Profile } from '../../screens/Profile';

describe('Profile', () => {
  it('should be displayed correctly placeholder for user input name', () => {
    const { getByPlaceholderText } = render(<Profile />);

    const inputName = getByPlaceholderText('Nome');
    expect(inputName).toBeTruthy();
  });

  it('should be render correctly user data', () => {
    const { getByTestId } = render(<Profile />);

    const inputName = getByTestId('input-name');
    const inputSurname = getByTestId('input-surname');

    expect(inputName.props.value).toEqual('Pedro');
    expect(inputSurname.props.value).toEqual('Zago');
  });

  it('should be render correctly title', () => {
    const { getByTestId } = render(<Profile />);

    const textTitle = getByTestId('text-title');

    expect(textTitle.props.children).toContain('Perfil');
  });
});
