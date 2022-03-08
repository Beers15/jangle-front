import React, { useEffect, useContext } from 'react';
import { useStateIfMounted } from 'use-state-if-mounted';
import { StoreState } from '../../../store';
import { SocketContext } from '../../../context/socket';
import { AuthContext } from '../../../context/auth';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import axios from 'axios';
import { setRoomMessages, Room, Rooms, Message, SetRoomMessagesAction } from '../../../store/actions';
import { Typography } from '@mui/material';

interface MessageStreamProps {
  setRoomMessages: (room: Room) => SetRoomMessagesAction;
  rooms: Rooms["rooms"];
}

const MessageStream = ({ setRoomMessages, rooms }: MessageStreamProps) => {
  const { nickname: username, getAuthHeader } = useContext(AuthContext);
  const { socket, currentRoom } = useContext(SocketContext) || {};

  let [messages, setMessages] = useStateIfMounted([] as Message[]);

  useEffect(() => {
    function listener() {
      let messages = rooms.get(`${currentRoom}`);
      if(messages) setMessages(messages);
    }

    if(socket) {
      socket.on('message', listener);

      return function cleanup() {
        socket.off('message', listener);
      };
    } else {
      console.log("Unable to connect to socket instance...")
    }
  }, [socket, rooms, messages, currentRoom]);

  useEffect(() => {
    (async () => {
      let config = await getAuthHeader();

      try {
        let res = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/messages/${currentRoom}`, config
        );
        if (res.data.length > 0) {
          setRoomMessages({ messages: res.data, roomname: `${currentRoom}` });
        }
          
        let messages = rooms.get(`${currentRoom}`);
        if(messages) setMessages(messages);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [currentRoom, rooms, setRoomMessages]);

  useEffect(() => {
    if (rooms.has(`${currentRoom}`)) {
      let messages = rooms.get(`${currentRoom}`);
      if(messages) {
        setMessages(messages);
      }
    }
  }, [currentRoom, rooms]);

  return (
    <>
      {messages && messages.length >= 1 && (
        <div className="message-container" data-testid="message-stream">
          {messages.map((msg: Message, idx) => {
              let date = new Date(msg.timestamp)
            return (
              <React.Fragment key={idx}>
                <div
                  className={
                    msg.username === username
                      ? 'myMessageRow'
                      : 'theirMessageRow'
                  }
                  >
                  <Typography
                    variant="body2"
                    style={{ fontWeight: 700, width: '300px', margin: '-5px -300px 0 0', justifyContent: msg.username !== username ? 'flexStart' : 'flexEnd', color: msg.username !== username ? 'white' : '#36393f', fontSize: msg.username !== username ? '.9rem' : '0.01rem' }}
                  >
                    {msg.username}
                  </Typography>
                  <p
                    className={
                      msg.username === username
                        ? 'myChatMessage'
                        : 'theirChatMessage'
                    }
                    key={idx}
                  >
                    {`${msg.content}`}
                  </p>
                </div>
                <Typography
                  className={
                    msg.username === username
                      ? 'myChatTimeStamp'
                      : 'theirChatTimeStamp'
                  }
                  style={{marginBottom: msg.username !== username ? '22px' : '-18px', }}
                  variant="caption"
                  key={idx}
                >                  
                {date.toDateString()} {" at "}{date.toLocaleTimeString()}
                </Typography>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({ rooms }: StoreState) => {
  return {
    rooms: rooms.rooms,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setRoomMessages: (data: Room) => dispatch(setRoomMessages(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageStream);
