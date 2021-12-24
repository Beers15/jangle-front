import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../../../context/socket';
import { connect } from 'react-redux';
import axios from 'axios';
import { setRoomMessages } from '../../../store/rooms';
import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, Tooltip, Typography } from '@mui/material';

const MessageStream = ({ setRoomMessages, rooms, username }) => {
  const { user } = useAuth0();
  username = user.nickname;
  const { socket, currentRoom } = useContext(SocketContext);
  let [messages, setMessages] = useState([]);

  useEffect(() => {
    function listener() {
      setMessages(rooms.get(currentRoom));
    }
    socket.on('message', listener);

    return function cleanup() {
      socket.off('message', listener);
    };
  }, [socket, rooms, messages, currentRoom]);

  useEffect(() => {
    (async () => {
      try {
        let res = await axios.get(`${process.env.REACT_APP_API_SERVER}/messages/${currentRoom}`);
        if (res.data.length > 0)
          setRoomMessages({ messages: res.data, roomname: currentRoom });
        setMessages(rooms.get(currentRoom));
      } catch (err) {
        console.log(err);
      }
    })()

  }, [currentRoom, rooms, setRoomMessages])

  useEffect(() => {
    if (rooms.has(currentRoom)) {
      setMessages(rooms.get(currentRoom));
    }
  }, [currentRoom, rooms]);

  return (
    <>
      {messages.length >= 1 && (
        <div className="message-container">
          {messages.map((msg, idx) => {
            return (
              <>
                <div className="myMessageRow">
                  <p className="myChatMessage" key={idx}>
                    {`${msg.content}`}
                  </p>
                  {/* <Tooltip title={`${username}`}>
                    <Avatar className="chatAvatar" alt={user.nickname} src={user.picture} />
                  </Tooltip> */}
                </div>
                <Typography id="myChatTimeStamp" variant="caption" key={idx}>
                  {`${msg.timeSentFormatted}`}
                </Typography>
              </>
            );
          })}
          <div className="theirMessageRow">
            <Tooltip title={`${username}`}>
              <Avatar className="chatAvatar" alt={user.nickname} src={user.picture} />
            </Tooltip>
            <p className="theirChatMessage">SAMPLE TEXT</p>
          </div>
          <Typography id="theirChatTimeStamp" variant="caption">
            12/23/2021 at 23:17 PST
          </Typography>

          <div className="theirMessageRow">
            <Tooltip title={`${username}`}>
              <Avatar className="chatAvatar" alt={user.nickname} src={user.picture} />
            </Tooltip>
            <p className="theirChatMessage">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta nesciunt voluptatibus aperiam asperiores quisquam dolores non.
            </p>
          </div>
          <Typography id="theirChatTimeStamp" variant="caption">
            12/23/2021 at 23:17 PST
          </Typography>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    rooms: state.rooms.rooms,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setRoomMessages: (data) => dispatch(setRoomMessages(data)),
});


export default connect(mapStateToProps, mapDispatchToProps)(MessageStream);
