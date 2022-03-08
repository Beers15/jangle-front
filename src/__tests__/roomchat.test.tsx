import '@testing-library/jest-dom/extend-expect';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/server';
import { renderApp } from '..//mocks';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(renderApp);

describe('Testing functionality of roomchat components', () => {
  it("Should create a room and switch to a new room after its creation", async () => {
    let roomchatBtn = screen.getByTestId('roomchat-btn');

    await waitFor(() => {
      fireEvent.click(roomchatBtn);
    });

    let createRoomBtn = screen.getByTestId('create-room-btn');

    await waitFor(() => {
      fireEvent.click(createRoomBtn);
    });

    let roomnameInput = screen.getByTestId('roomname-input').querySelector('input');
    expect(roomnameInput).toBeInTheDocument();

    await waitFor(() => {
      userEvent.type(roomnameInput as HTMLInputElement, "Test-Room");
    });

    expect((roomnameInput as HTMLInputElement).value).toBe('Test-Room');

    let roomSubmitBtn = screen.getByTestId('room-submit-btn');
    await waitFor(() => {
      fireEvent.click(roomSubmitBtn);
    });

    await waitFor(() => {
      let testRoom = screen.getByTestId('room-Test-Room');
      expect(testRoom).toBeInTheDocument();
    })
  });
});