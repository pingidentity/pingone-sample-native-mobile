import React, {Component} from 'react';
import {ActivityIndicator, LayoutAnimation, Modal, UIManager, View} from 'react-native';
import {Button, ButtonContainer, Heading, Page, TokenInfo, UserInfo, Tables} from './components';
import {AUTH_CONFIG} from './config'
import {authorize} from 'react-native-app-auth';
import {signOff} from './api'

import {
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      // For a proper layout at the 1st rendering
      orientation: 'portrait',
      inProgress: false,
      authStateParam: null,
      accessToken: null,
      idToken: null,
      idTokenJSON: null,
      userInfo: null
    };

    this.dataHandler = this.dataHandler.bind(this)
  }

  componentDidMount() {
    lor(this);
  }

  componentWillUnmount() {
    rol();
  }

  animateState(nextState: $Shape<State>, delay: number = 0) {
    setTimeout(() => {
      this.setState(() => {
        LayoutAnimation.easeInEaseOut();
        return nextState;
      });
    }, delay);
  }

  dataHandler({idToken, userInfo}) {
    this.setState({
      idTokenJSON: idToken !== undefined ? idToken : this.state.idTokenJSON,
      userInfo: userInfo === undefined ? this.state.userInfo : userInfo,
    })
  }

  authorize = async () => {
    this.setState({
      inProgress: true
    })

    try {
      const authState = await authorize(AUTH_CONFIG);
      this.animateState(
          {
            accessToken: authState.accessToken,
            idToken: authState.idToken,
            inProgress: false
          },
          500
      );
    } catch (error) {
      console.error(error);
      this.setState({
        inProgress: false
      })
    }
  };

  signOff = async () => {
    this.setState({
      inProgress: true
    })
    try {
      if (this.state.idToken) {
        await signOff(this.state.idToken);
        this.animateState({
          accessToken: null,
          idToken: null,
          idTokenJSON: null,
          userInfo: null,
          inProgress: false
        });
      }
    } catch (error) {
      console.error(error);
      this.setState({
        inProgress: false
      })
    }
  };

  render() {
    const {state} = this;
    let buttons = null;
    let body_container = null;
    let spinner = this.state.inProgress && (
        <Modal transparent={true} animationType={'none'}
               visible={this.state.inProgress}>
          <View style={{
            flex: 1, alignItems: 'center', flexDirection: 'column',
            justifyContent: 'space-around'
          }}>
            <ActivityIndicator size="large"/>
          </View>
        </Modal>
    )

    if (state.accessToken || state.idToken) {
      body_container = (
          <View style={{
            flex: 1,
            flexDirection: 'column'
          }}>
            <View style={{
              flex: 3,
              flexDirection: (this.state.orientation == 'portrait') ? 'column'
                  : 'row',
              justifyContent: 'space-around'
            }}>
              <Heading fontSize={this.state.orientation == 'portrait' ? hp('3%')
                  : hp('7%')}
                       textAlign={this.state.orientation == 'portrait'
                           ? 'center' : 'right'}
                       marginRight={hp('3%')}>Congratulations! </Heading>
              <Heading fontSize={this.state.orientation == 'portrait' ? hp('3%')
                  : hp('7%')}
                       textAlign={this.state.orientation == 'portrait'
                           ? 'center' : 'left'}>This is a secure
                resource.</Heading>
            </View>

            <Tables data={[state.idTokenJSON, state.userInfo]}
                    orientation={this.state.orientation}
                    style={{
                      flex: 30,
                      flexDirection: (this.state.orientation == 'portrait')
                          ? 'column'
                          : 'row'
                    }}
            />
            <ButtonContainer bottom={45}
                             flexDirection={(this.state.orientation
                                 == 'portrait') ? 'column' : 'row'}>
              <TokenInfo idToken={state.idToken}
                         dataHandler={this.dataHandler}/>
              <UserInfo accessToken={state.accessToken}
                        dataHandler={this.dataHandler}/>
            </ButtonContainer>
          </View>
      );

      buttons = (
          <ButtonContainer>
            <Button onPress={this.signOff} text="Sign Off"/>
          </ButtonContainer>
      )
    } else {
      body_container = (
          <View style={{flex: 1, alignItems: 'center', alignContent: 'center'}}>
            <Heading marginTop={hp('20%')}>You are not currently
              authenticated.</Heading>
            <Heading fontSize={hp('5%')} marginBottom={hp('45%')}>Click Sign On
              to get started.</Heading>
          </View>
      )
      buttons = (
          <ButtonContainer>
            <Button onPress={this.authorize} text="Sign On"/>
          </ButtonContainer>)
    }

    return (
        <Page>
          {spinner}
          {body_container}
          {buttons}
        </Page>
    );
  }
}
