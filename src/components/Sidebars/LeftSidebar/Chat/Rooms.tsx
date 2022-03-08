import { useEffect, useContext, useRef, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { TreeView } from '@mui/lab';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { setRooms, SetRoomsAction, Room } from '../../../../store/actions';
import { AuthContext } from '../../../../context/auth';
import { SocketContext } from '../../../../context/socket';
import Public from './Public';
import DirectMessage from './DirectMessage';
import CreateRoom from './CreateRoom';
import { LeftSidebarComponentsProps } from '../';

const theme: Theme = createTheme({
  palette: {
    primary: {
      main: '#000',
    },
  },
});

interface RoomsProps extends LeftSidebarComponentsProps {
  setRooms(rooms: Room[]): SetRoomsAction;
}

const Rooms = ({ setRooms, joinRoom, getDirectRoomsForUser }: RoomsProps): JSX.Element => {
  let mounted = useRef<boolean>(false);

  const { nickname, getAuthHeader } = useContext(AuthContext);
  const { currentRoom } = useContext(SocketContext) || {};

  const [publicRooms, setPublicRooms] = useState<Room[]>([]);
  const [directMsgRooms, setDirectMsgRooms] = useState<Room[]>([]);

  useEffect(() => {
    mounted.current = true;
    return (() => { mounted.current = false } )
  }, []);

  useEffect(() => {
    (async () => {
      let res = null;
      const config = await getAuthHeader();
      try {
        res = await axios.get(`${process.env.REACT_APP_API_SERVER}/rooms`, config);
        
        setRooms(res.data);
        mounted.current && setPublicRooms(
          res.data.filter((room: Room) => !room.password && room.users?.length === 0 ? room : false )
        ) 
        mounted.current && setDirectMsgRooms(getDirectRoomsForUser(res.data))
      } catch (err) {
        console.log(err);
      }
    })();
  }, [setRooms, currentRoom, nickname]);

  return (
    <div className="rooms-container">
      <ThemeProvider theme={theme}>
        <CreateRoom />
        <TreeView
          color="primary"
          defaultExpanded={['0', '1', '2']}
          aria-label="room navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ height: 240, flexGrow: 1, maxWidth: 400 }}
        >
          <Public joinRoom={joinRoom} rooms={publicRooms} />
          {directMsgRooms.length > 0 && (
            <DirectMessage
              startNodeId="1"
              joinRoom={joinRoom}
              rooms={directMsgRooms}
            />
          )}
        </TreeView>
      </ThemeProvider>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setRooms: (rooms: Room[]) => dispatch(setRooms(rooms)),
});

export default connect(null, mapDispatchToProps)(Rooms);
