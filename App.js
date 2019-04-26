import React, { Component } from 'react';
import { UIManager, LayoutAnimation } from 'react-native';
import {authorize, refresh, revoke} from 'react-native-app-auth';
import { Page, Button, ButtonContainer, Form, Heading } from './components';
// import config from 'config/config'

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);


type State = {
  hasLoggedInOnce: boolean,
  accessToken: ?string,
  accessTokenExpirationDate: ?string,
  refreshToken: ?string
};

export default class App extends Component<{}, State> {

  state = {
    hasLoggedInOnce: false,
    accessToken: '',
    accessTokenExpirationDate: '',
    refreshToken: ''
  };

  animateState(nextState: $Shape<State>, delay: number = 0) {
    setTimeout(() => {
      this.setState(() => {
        LayoutAnimation.easeInEaseOut();
        return nextState;
      });
    }, delay);
  }

  authorize = async () => {
    try {
      const config = {
        // issuer: config.AUTH_URI + config.authDetails.environmentId + '/as',
        // clientId: config.authDetails.clientId,
        // redirectUrl: config.authDetails.redirectUri

        issuer: 'https://auth.pingone.com/c2c2b4f8-c3da-4b23-abef-457ceaf25591/as',
        clientId: 'df86b400-985f-42e4-a349-bd1ab10bb625',
        redirectUrl: 'com.example.app:/redirect_uri_path',
        scopes: ['openid', 'profile', 'email', 'address']
      };
      const authState = await authorize(config);
      this.animateState(
          {
            hasLoggedInOnce: true,
            accessToken: authState.accessToken,
            accessTokenExpirationDate: authState.accessTokenExpirationDate,
            refreshToken: authState.refreshToken
          },
          500
      );
    } catch (error) {
      console.error(error);
    }
  };

  refresh = async () => {
    try {
      const authState = await refresh(this.state.refreshToken, scopes);
      this.animateState({
        accessToken: authState.accessToken || this.state.accessToken,
        accessTokenExpirationDate:
            authState.accessTokenExpirationDate || this.state.accessTokenExpirationDate,
        refreshToken: authState.refreshToken || this.state.refreshToken
      });
    } catch (error) {
      console.error(error);
    }
  };

  revoke = async () => {
    try {
      await revoke(this.state.accessToken);
      this.animateState({
        accessToken: '',
        accessTokenExpirationDate: '',
        refreshToken: ''
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const {state} = this;
    return (
        <Page>
          {!!state.accessToken ? (
              <Form>
                <Form.Label>accessToken</Form.Label>
                <Form.Value>{state.accessToken}</Form.Value>
                <Form.Label>accessTokenExpirationDate</Form.Label>
                <Form.Value>{state.accessTokenExpirationDate}</Form.Value>
                <Form.Label>refreshToken</Form.Label>
                <Form.Value>{state.refreshToken}</Form.Value>
              </Form>
          ) : (
              <Heading>{state.hasLoggedInOnce ? 'Goodbye.' : 'Hello, stranger.'}</Heading>
          )}

          <ButtonContainer>
            {!state.accessToken && (
                <Button onPress={this.authorize} text="Authorize" color="#017CC0"/>
            )}
            {!!state.refreshToken && <Button onPress={this.refresh} text="Refresh" color="#24C2CB"/>}
            {!!state.accessToken && <Button onPress={this.revoke} text="Revoke" color="#EF525B"/>}
          </ButtonContainer>
        </Page>
    );
  }
}
