import { rest } from 'msw';
import { Message } from '../store/actions/types';

type Room = {
  roomname: string;
  users: string[];
};

let rooms: Room[] = [
  { roomname: 'general', users: [] },
  { roomname: 'random', users: [] },
];

const messages: any = [];

export const handlers = [
  rest.get(
    `${process.env.REACT_APP_API_SERVER}/profiles/testymctesterson/random`,
    (req, res, ctx) => {
      const response = {
        username: 'nottestymctesterson',
        interests: ['music'],
        bio: 'Hello there.',
      };

      return res(ctx.status(200), ctx.json(response));
    }
  ),
  rest.get(`${process.env.REACT_APP_API_SERVER}/rooms`, (req, res, ctx) => {
    const response = rooms;
    return res(ctx.status(200), ctx.json(response));
  }),
  rest.get(
    `${process.env.REACT_APP_API_SERVER}/profiles/testymctesterson`,
    (req, res, ctx) => {
      const response = {
        username: 'nottestymctesterson',
        interests: ['music'],
        bio: 'Hello there.',
      };

      return res(ctx.status(200), ctx.json(response));
    }
  ),
  rest.get(
    `${process.env.REACT_APP_API_SERVER}/messages/*`,
    (req, res, ctx) => {
      const response: Message[] = messages;

      return res(ctx.status(200), ctx.json(response));
    }
  ),
  rest.post(`${process.env.REACT_APP_API_SERVER}/rooms`, (req, res, ctx) => {
    let body = req.body as Room;
    body.users = [];
    rooms.push(body);

    return res(ctx.status(201));
  }),
  //fake route to simulating what happens when socket-client fires the message event
  rest.post('mock/messages', (req, res, ctx) => {
    let body = req.body;
    messages.push(body);

    return res(ctx.status(201));
  }),
];
