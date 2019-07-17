import React from 'react';
import {getUserInfo} from '../api';
import {Button} from '.';

/**
 * React component to trigger displaying user access token details.
 */
class UserInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      spinner: false,
      userInfo: null,
      errorMessage: ''
    };

    this.showUserInfo = this.showUserInfo.bind(this);
    this.hideUserInfo = this.hideUserInfo.bind(this);
  }

  hideUserInfo (event) {
    this.props.dataHandler({userInfo: null})

    this.setState({
      userInfo: null
    });
  }

  showUserInfo(event) {
    this.props.dataHandler({userInfo: {isLoading: true}})

    getUserInfo(this.props.accessToken)
    .then(userData => {
      this.props.dataHandler({
        userInfo: {
          body: userData,
          isLoading: false
        }
      })

      this.setState({
        userInfo: userData
      })
    })
    .catch(error => {
      const errorDetail = error.details ? error.details[0].code : null;
      if (errorDetail === 'INVALID_TOKEN') {
        if (error.details[0].message.includes(
            "Access token expired")) {
          this.setState({
            errorMessage: 'Your access token is expired. Please try to login again.'
          });
        } else {
          this.setState({
            errorMessage: error.details[0].message
          });
        }
      } else if (errorDetail) {
        this.setState({
          errorMessage: errorDetail + ': ' + error.details[0].message
        });
      } else if (error.error || error.error_description) {
        this.setState({
          errorMessage: error.error + ': ' + error.error_description
        });
      }
      return Promise.reject(error);
    });

  }

  render() {
    const {userInfo, errorMessage} = this.state;
    errorMessage && (alert(errorMessage));

    return userInfo ? (
        <Button onPress={this.hideUserInfo} text="Hide User Information"/>
    ) : (
        <Button onPress={this.showUserInfo} text="Show User Information"/>
    )
  }
}

export default UserInfo;

