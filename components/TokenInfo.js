import React from 'react';
import {Button} from '.';
import {Buffer} from "buffer";

/**
 * React component to trigger displaying user id token details.
*/
class TokenInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      idTokenJSON: null
    };

    this.showTokenInfo = this.showTokenInfo.bind(this);
    this.hideTokenInfo = this.hideTokenInfo.bind(this);
  }

  hideTokenInfo (event)  {
    this.props.dataHandler({idToken: null})

    this.setState({
      idTokenJSON: null
    });
  }

  showTokenInfo (event) {
    const jwtBody = this.props.idToken.split('.')[1];
    const base64 = jwtBody.replace('-', '+').replace('_', '/');
    const decodedJwt = Buffer.from(base64, 'base64');

    this.props.dataHandler({idToken: {body: JSON.parse(decodedJwt)}})

    this.setState({
      idTokenJSON: JSON.parse(decodedJwt)
    })
  }

  render() {
    const {idTokenJSON} = this.state;

    return idTokenJSON ? (
        <Button onPress={this.hideTokenInfo} text="Hide Token Information"/>
    ) : (
        <Button onPress={this.showTokenInfo} text="Show Token Information"/>
    )
  }
}

export default TokenInfo;


