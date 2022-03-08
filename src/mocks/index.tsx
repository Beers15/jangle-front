import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../store';
import App from '../App';
import AuthProvider from '../context/auth';
import SocketProvider from '../context/socket';
import { mockUseAuth0 } from './auth';
import ResizeObserver from 'resize-observer-polyfill';
global.ResizeObserver = ResizeObserver;
window.ResizeObserver = ResizeObserver;

jest.mock('socket.io-client', () => {
  return {
    io: jest.fn().mockImplementation(() => {
      return {
        on: jest.fn(),
        emit: jest.fn(),
        off: jest.fn()
      };
    })
  }
});

jest.mock('@auth0/auth0-react');

export const renderApp = () => {
  mockUseAuth0();

  render(
    <Provider store={store()}>
      <AuthProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AuthProvider>
    </Provider>
  );
}