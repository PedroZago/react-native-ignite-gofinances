import * as mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { renderHook, act } from '@testing-library/react-hooks';
import { startAsync } from 'expo-auth-session';
import { mocked } from 'ts-jest/utils';

import { userKey } from '../../constants';
import { AuthProvider, useAuth } from '../../hooks/useAuth';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('expo-auth-session');

describe('Auth Hok', () => {
  beforeEach(async () => {
    await mockAsyncStorage.removeItem(userKey);
  });

  it('should be able to sign in with Google account existed', async () => {
    const googleMocked = mocked(startAsync as any);
    googleMocked.mockReturnValueOnce({
      type: 'success',
      params: {
        access_token: 'secret',
      },
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            id: 'userInfo.id',
            given_name: 'userInfo.given_name',
            email: 'userInfo.email',
            picture: 'userInfo.picture',
            locale: 'userInfo.locale',
            verified_email: 'userInfo.verified_email',
          }),
      })
    ) as jest.Mock;

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(() => result.current.signInWithGoogle());

    expect(result.current.user).toBeTruthy();
  });

  it('should be not able to sign in with Google account', async () => {
    const googleMocked = mocked(startAsync as any);
    googleMocked.mockReturnValueOnce({
      type: 'success',
      params: {
        access_token: 'secret',
      },
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.reject('Ocorreu algum erro'),
      })
    ) as jest.Mock;

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    try {
      await act(async () => await result.current.signInWithGoogle());
    } catch {
      expect(result.current.user).toEqual({});
    }
  });

  it('user should not connect if cancel authentication with Google', async () => {
    const googleMocked = mocked(startAsync as any);
    googleMocked.mockReturnValue({
      type: 'cancel',
    });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(() => result.current.signInWithGoogle());

    expect(result.current.user).not.toHaveProperty('id');
  });
});
