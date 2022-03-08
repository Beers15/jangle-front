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
      const response: Message[] = [];

      return res(ctx.status(200), ctx.json(response));
    }
  ),
  rest.post(`${process.env.REACT_APP_API_SERVER}/rooms`, (req, res, ctx) => {
    let body = req.body as Room;
    body.users = [];
    rooms.push(body as Room);

    return res(ctx.status(201));
  }),
];
