import React, {Component} from 'react';
import {LayoutAnimation, UIManager, View} from 'react-native';
import {authorize, refresh} from 'react-native-app-auth';
import {getUserInfo, signOff} from './sdk/api'
import {Button, ButtonContainer, Form, Heading, Page, UserInfo} from './components';
import config from './config'
import {Buffer} from 'buffer';

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

type State = {
  accessToken: ?string,
  accessTokenExpirationDate: ?string,
  refreshToken: ?string,
  idToken: ?string
};

export default class App extends Component<{}, State> {

  state = {
    accessToken: '',
    accessTokenExpirationDate: '',
    authStateParam: null,
    refreshToken: '',
    idToken: ''
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
      const authState = await authorize({
        issuer: config.AUTH_URI + '/' + config.authDetails.environmentId
            + '/as',
        clientId: config.authDetails.clientId,
        clientSecret: config.authDetails.clientSecret,
        redirectUrl: config.authDetails.redirectUri,
        scopes: config.authDetails.scope,
        usePKCE: config.authDetails.usePKCE,
        useNonce: config.authDetails.useNonce

      });
      this.animateState(
          {
            accessToken: authState.accessToken,
            accessTokenExpirationDate: authState.accessTokenExpirationDate,
            refreshToken: authState.refreshToken,
            idToken: authState.idToken
          },
          500
      );
    } catch (error) {
      console.error(error);
    }
  };

  getIdTokenClaims = async () => {
    try {
      if (state.idToken) {
        const jwtBody = state.idToken.split('.')[1];
        const base64 = jwtBody.replace('-', '+').replace('_', '/');
        const decodedJwt = Buffer.from(base64, 'base64');
        state.idTokenJSON = JSON.parse(decodedJwt);
      }
      const authState = await refresh(this.state.refreshToken, scopes);
      this.animateState({
        accessToken: authState.accessToken || this.state.accessToken,
        accessTokenExpirationDate:
            authState.accessTokenExpirationDate
            || this.state.accessTokenExpirationDate,
        refreshToken: authState.refreshToken || this.state.refreshToken,
        idToken: authState.idToken || this.state.idToken
      });
    } catch (error) {
      console.error(error);
    }
  };

  getUserInfo = async () => {
    try {
      const userInfo = await getUserInfo(this.state.accessToken);
      this.animateState({
        userInfo: userInfo
      });
    } catch (error) {
      console.error(error);
    }
  };

  signOff = async () => {
    try {
      await signOff(this.state.idToken);
      this.animateState({
        accessToken: '',
        accessTokenExpirationDate: '',
        refreshToken: '',
        idToken: ''
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const {state} = this;
    let id_token_part = null;
    let buttons = null;
    let body_container = null;

    if (state.accessToken) {
      body_container = (
            <Form>
              <Form.Label>accessToken</Form.Label>
              <Form.Value>{state.accessToken}</Form.Value>
              <Form.Label>accessTokenExpirationDate</Form.Label>
              <Form.Value>{state.accessTokenExpirationDate}</Form.Value>
              <UserInfo accessToken={state.accessToken}/>
            </Form>
      );

      buttons = (
          <ButtonContainer>
            <Button onPress={this.signOff} text="Sign Off"
                    color="#017CC0"/>
          </ButtonContainer>
      )
    } else {
      body_container = (
          <Heading>You are not currently authenticated. Click Sign On to get
            started.</Heading>)
      buttons = (
          <ButtonContainer>
            <Button onPress={this.authorize} text="Sign On"
                    color="#017CC0"/>
          </ButtonContainer>)
    }

    return (
        <Page>
          {body_container}
          {buttons}
          {/*{!state.accessToken && (*/}
          {/*<Button onPress={this.authorize} text="Sign On"*/}
          {/*color="#017CC0"/>*/}
          {/*)}*/}
          {/*{!!state.refreshToken && <Button onPress={this.refresh}*/}
          {/*text="Refresh" color="#24C2CB"/>}*/}
          {/*{!!state.accessToken && <Button onPress={this.revoke} text="Revoke"*/}
          {/*color="#EF525B"/>}*/}
        </Page>
    );
  }
}
