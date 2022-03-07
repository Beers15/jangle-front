import { useAuth0 } from '@auth0/auth0-react';

const user = {
  email: 'foo@test.com',
  nickname: 'testymctesterson',
  email_verified: true,
  sub: 'google-oauth2|12345678901234',
  isAuthenticated: true,
};

export const mockUseAuth0 = () => {
  (useAuth0 as jest.Mock).mockReturnValue({
    isAuthenticated: true,
    user,
    // eslint-disable-next-line no-unused-labels
    getIdTokenClaims: jest.fn().mockReturnValue({ __raw: undefined }),
  });
};
