import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Button,
} from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';
import swal from 'sweetalert';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7289da',
    },
    secondary: {
      main: '#7db1b1',
    },
  },
});

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

const Profile = () => {
  const { user } = useAuth0();
  const [selected, setSelected] = useState();
  const [bio, setBio] = useState('');
  const [currentFile, setCurrentFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  const interests = [
    { label: 'Music', value: 'music' },
    { label: 'Crafts & DIY', value: 'craftsdiy' },
    { label: 'Gaming', value: 'gaming' },
    { label: 'Cooking & Food', value: 'cookingfood' },
    { label: 'Sports', value: 'sports' },
    { label: 'LGBTQIA+', value: 'lgbtqia' },
    { label: 'Art & Design', value: 'artdesign' },
    { label: 'Literature & Writing', value: 'litwriting' },
    { label: 'Nature & Travel', value: 'naturetravel' },
    { label: 'History & Politics', value: 'historypolitics' },
    { label: 'Fitness & Recreation', value: 'fitnessrec' },
    { label: 'Community & Public Service', value: 'commpubsrvc' },
    { label: 'Technology', value: 'technology' },
    { label: 'Healthcare', value: 'healthcare' },
    { label: 'Finance', value: 'finance' },
  ];

  useEffect(() => {
    (async () => {
      try {
        //auto-populates form fields with existing profile data, if they have a profile
        let res = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/profiles/${user.nickname}`
        );
        if(res.data[0]) {
          setSelected(res.data[0].interests);
          setBio(res.data[0].bio);
          setPreviewImage(res.data[0].image);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [user.nickname]);

  const handleSelected = (event, newSelection) => {
    setSelected(newSelection);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", currentFile);
    formData.append("interests", selected);
    formData.append("bio", bio);
    formData.append("username", user.nickname);

    let method;
    let url;
    let res = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/profiles/${user.nickname}`
    );

    //if there is a user profile already update it, else create a new one
    method = res.data.length > 0 ? 'put' : 'post';
    url = res.data.length > 0 ?  
      `${process.env.REACT_APP_API_SERVER}/profiles/${user.nickname}` :  
      `${process.env.REACT_APP_API_SERVER}/profiles`;

    console.log(method, url)
    await axios({
      method,
      url,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    swal({
      title: 'Success!',
      text: 'Your profile has been updated. Enjoy socializing!',
      icon: 'success',
      // className: 'swal-button--confirm',
    });
  };

  const selectFile = (e) => {
    setCurrentFile(e.target.files[0]);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div id="profile">
      <ThemeProvider theme={theme}>
        <Paper
          id="profilePaper"
          elevation={0}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="h5" mb={2}>Profile</Typography>     
            <form onSubmit={handleSubmit}>
              <label htmlFor="profileImg">
                <input
                  id="profileImg"
                  name="profileImg"
                  style={{ display: 'none' }}
                  type="file"
                  accept="image/*"
                  onChange={selectFile} 
                />
                <Button
                  className="btn-choose"
                  variant="outlined"
                  component="span" >
                  Choose a Profile Image
                </Button>
              </label>
              <Button
                className="btn-upload"
                color="primary"
                variant="contained"
                component="span"
                disabled={!currentFile}
              >
                Upload
              </Button>
              <div className="file-name">
                {currentFile ? currentFile.name : null}
              </div>

              {previewImage && (
                <div style={{ alignSelf: 'center', }}>
                  <img style={{ width: '400px', height: '250px' }} src={previewImage} alt="uploaded profile image" />
                </div>
              )}
              <p>Choose Some Interests:</p>
              <StyledToggleButtonGroup
                id="toggleGroup"
                size="small"
                value={selected}
                aria-label="text formatting"
                onChange={handleSelected}
              >
                {interests.map((interest) => {
                  return (
                    <ToggleButton
                      key={interest.value}
                      className="interestBtn"
                      color="primary"
                      value={interest.value}
                      aria-label={interest.value}
                    >
                      {interest.label}
                    </ToggleButton>
                  );
                })}
            </StyledToggleButtonGroup>
            <TextField
              color="primary"
              id="outlined-multiline-static"
              name="bio"
              label="Enter a Bio:"
              defaultValue={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              sx={{ width: '100%' }}
              placeholder="Tell other users about yourself..."
              multiline
              autoFocus
              required
            />
            <div className="profileRow">
              <Button
                className="updateBtn"
                size="large"
                variant="contained"
                color="secondary"
                endIcon={<CheckIcon />}
                type="submit"
              >
                Submit
              </Button>
            </div>
          </form>
        </Paper>
      </ThemeProvider>
    </div>
  );
};

export default Profile;
