import '@testing-library/jest-dom/extend-expect';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/server';
import { renderApp } from '..//mocks';
import axios from 'axios';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(renderApp);

describe('Testing functionality of roomchat components', () => {
  it("Should create a room and switch to a new room after its creation", async () => {
    let roomchatBtn = screen.getByTestId('roomchat-btn');
    expect(roomchatBtn).toBeInTheDocument();

    fireEvent.click(roomchatBtn);

    let roomname = 'Test-Room';

    createRoom(roomname);

    await waitFor(() => {
      let testRoom = screen.getByTestId('room-' + roomname);
      expect(testRoom).toBeInTheDocument();
    })
  });

  it('Should display an entered message in the message stream.', async () => {
    const container = document.querySelector('.roomchat-container') || { scroll: jest.fn() };
    let roomname = 'general';
    let testMessage = 'Test Message #1'

    if(container) {
      container.scroll = jest.fn();
    }

    createRoom(roomname);
    
    await waitFor(async () => {
      let messageBarInput = screen.getByTestId('message-bar-input').querySelector('input');
      expect(messageBarInput).toBeInTheDocument();

     
      fireEvent.change(messageBarInput as HTMLInputElement, {target: {value: testMessage}});
      expect((messageBarInput as HTMLInputElement).value).toBe(testMessage);

      let messageBarForm = screen.getByTestId('message-bar-form');
      fireEvent.submit(messageBarForm);

      //simulates persisting the new message as if the socket-client fired the message event and the server handled it
      await axios.post('mock/messages', {
        content: testMessage,
        roomname,
        username: 'testymctesterson',
        timestamp: new Date()
      });
    });

    await waitFor(async () => {
      let messageContent = screen.getByTestId('message-' + testMessage);
      expect(messageContent).toBeInTheDocument();
      expect(container.scroll).toHaveBeenCalled();
    });
  });
});

function createRoom(roomname :string): void {
  let createRoomBtn = screen.getByTestId('create-room-btn');
  fireEvent.click(createRoomBtn);
   
  let roomnameInput = screen.getByTestId('roomname-input').querySelector('input');
  expect(roomnameInput).toBeInTheDocument();

  userEvent.type(roomnameInput as HTMLInputElement, roomname);
  expect((roomnameInput as HTMLInputElement).value).toBe(roomname);

  let roomSubmitBtn = screen.getByTestId('room-submit-btn');

  fireEvent.click(roomSubmitBtn);
}