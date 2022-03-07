import '@testing-library/jest-dom/extend-expect';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { server } from '../mocks/server';
import { renderApp } from '..//mocks';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(renderApp);

describe('Testing core behaviors of app', () => {
  it("Should properly render the application's landing page components", async () => {
    let header = screen.getByTestId('header');
    let mainContainer = screen.getByTestId('main-container');
    let leftSidebar = screen.getByTestId('left-sidebar');
    let footer = screen.getByTestId('footer');

    expect(header).toBeInTheDocument();
    expect(mainContainer).toBeInTheDocument();
    expect(leftSidebar).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('Should have the roomchat page render the proper components when first visited', async () => {
    let roomchatBtn = screen.getByTestId('roomchat-btn');

    await waitFor(() => {
      fireEvent.click(roomchatBtn);
    });

    let roomchat = screen.getByTestId('roomchat-container');
    let createRoomBtn = screen.getByTestId('create-room-btn');
    let userlist = screen.getByTestId('userlist');
    expect(roomchat).toBeInTheDocument();
    expect(createRoomBtn).toBeInTheDocument();
    expect(userlist).toBeInTheDocument();
  });

  it('Should have the matcher page render the proper components when first visited', async () => {
    let matcherBtn = screen.getByTestId('matcher-left-btn');

    await waitFor(() => {
      fireEvent.click(matcherBtn);
    });

    let matcherLanding = screen.getByTestId('matcher-landing');
    let matcherLandingBtn = screen.getByTestId('matcher-landing-btn');
    let matcherRooms = screen.getByTestId('matcher-rooms');

    expect(matcherLanding).toBeInTheDocument();
    expect(matcherLandingBtn).toBeInTheDocument();
    expect(matcherRooms).toBeInTheDocument();
  });

  it('Should have the profile page render the proper components when first visited', async () => {
    let profileBtn = screen.getByTestId('profile-left-btn');

    await waitFor(() => {
      fireEvent.click(profileBtn);
    });

    let profileContainer = screen.getByTestId('profile-container');
    let uploadProfileimageBtn = screen.getByTestId('upload-profileimage-btn');
    let toggleBtn = screen.getByTestId('toggle-btn-music'); //just seeing if one of many interests renders
    let profileBioField = screen.getByTestId('profile-bio-field');
    let profileSubmitBtn = screen.getByTestId('profile-submit-btn');

    expect(profileContainer).toBeInTheDocument();
    expect(uploadProfileimageBtn).toBeInTheDocument();
    expect(toggleBtn).toBeInTheDocument();
    expect(profileBioField).toBeInTheDocument();
    expect(profileSubmitBtn).toBeInTheDocument();
  });

  it('Should render a "random" user\'s card when the matcher feature is used', async () => {
    server.listen();

    let matcherBtn = screen.getByTestId('matcher-left-btn');

    let matcherLanding;
    await waitFor(() => {
      fireEvent.click(matcherBtn);
      matcherLanding = screen.getByTestId('matcher-landing');
    });

    expect(matcherLanding).toBeInTheDocument();

    let matcherLandingBtn = screen.getByTestId('matcher-landing-btn');

    let matcherCard;
    await waitFor(() => {
      fireEvent.click(matcherLandingBtn);
      matcherCard = screen.getByTestId('matcher-card');
    });

    expect(matcherCard).toBeInTheDocument();

    let matcherUsername = screen.getByTestId('matcher-username');
    let matcherInterests = screen.getByTestId('matcher-interests-music');
    let matcherBio = screen.getByTestId('matcher-bio');

    expect(matcherUsername).toHaveTextContent('nottestymctesterson');
    expect(matcherInterests).toHaveTextContent('music');
    expect(matcherBio).toHaveTextContent('Hello there.');
  });
});
