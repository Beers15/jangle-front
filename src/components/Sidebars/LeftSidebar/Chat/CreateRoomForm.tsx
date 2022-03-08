import React, { useContext, useState } from 'react';
import {
  MenuItem,
  InputBase,
  Button,
  Typography,
  Divider,
} from '@mui/material';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';
import { AuthContext } from '../../../../context/auth';
import { SocketContext } from '../../../../context/socket';
import swal from 'sweetalert';

const theme: Theme = createTheme({
  palette: {
    primary: {
      main: '#7db1b1',
    },
  },
});

interface CreateRoomFormProps {
  handleClose(): void; 
}

const CreateRoomForm = ({ handleClose }: CreateRoomFormProps): JSX.Element => {
  const { nickname, getAuthHeader } = useContext(AuthContext);
  const { socket, setCurrentRoom } = useContext(SocketContext) || {};
  const [ roomname, setRoomname] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await addRoomToServer(roomname);
    handleClose();
  };

  const displayAlert = (alertText: string): void => {
    swal({
      title: 'Oh no!',
      text: alertText,
      icon: 'warning',
      dangerMode: true,
    });      
  }

  const addRoomToServer = async (roomname: string): Promise<void> => {
    let body = { roomname };
    let config = await getAuthHeader();

    try {
      let res = await axios.post(`${process.env.REACT_APP_API_SERVER}/rooms`, body, config);
      setCurrentRoom && setCurrentRoom(res.data.roomname);
      try {
        if(socket) {
          socket.emit('join', {
            room: res.data.roomname,
            user: nickname,
          });

          setCurrentRoom && setCurrentRoom(roomname);
        } else {
          displayAlert('Unable to connect with server.');
        }
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
      displayAlert('Unable to create a room with that name. It may already exist.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <form id="createRoomForm" onSubmit={handleSubmit}>
        <Typography variant="subtitle1" sx={{ marginLeft: '10px' }}>
          New Room Details
        </Typography>
        <Divider style={{ backgroundColor: '#99aab5' }} />
        <MenuItem>
          <InputBase
            id="roomname"
            data-testid="roomname-input"
            name="roomname"
            placeholder="Room Name"
            sx={{ color: 'white' }}
            onChange={(e) => setRoomname(e.target.value)}
            required
          />
        </MenuItem>
        <div style={{display: 'flex', justifyContent: 'center' }}>
        <Button
          data-testid="room-submit-btn"
          variant="contained"
          size="small"
          id="room-submit-btn"
          color="primary"
          endIcon={<CheckIcon />}
          type="submit"
        >
          Create
        </Button>
        </div>
      </form>
    </ThemeProvider>
  );
};

export default CreateRoomForm;
