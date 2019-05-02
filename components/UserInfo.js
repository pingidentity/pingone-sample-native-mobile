import React from 'react';
import {getUserInfo} from '../sdk/api';
import {Button, Text, View} from 'react-native'
import { Table, TableWrapper, Rows, Row, Col, Cols } from 'react-native-table-component';

/**
 * React component for managing the return entry point of the implicit OAuth 2.0 flow and is expecting "access_token", "id_token" or "code" in a redirect uri.
 * The user will be redirected to this point based on the redirect_uri in config.js - the URL that specifies the return entry point of this application.
 */
class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
      errorMessage: ''
    };

    this.handleUserInfo = this.handleUserInfo.bind(this);
    this.hideUserInfo = this.hideUserInfo.bind(this);
  }

  hideUserInfo() {
    this.setState({
      userInfo: null
    });
  }

  handleUserInfo = async () => {

    const userInfo = await getUserInfo(this.props.accessToken)
    .catch(error => {
      const errorDetail = error.details ? error.details[0].code : null;
      if (errorDetail === 'INVALID_VALUE') {
        if (error.details[0].message.includes(
            "Access token expired")) {
          this.setState({
            errorMessage: 'Your access token is expired. Please login again.'
          });
        } else {
          this.setState({
            errorMessage: error.details[0].message
          });
        }
      } else if (errorDetail) {
        this.setState({
          errorMessage: errorDetail + error.details[0].message
        });
      } else if (error.error || error.error_description) {
        this.setState({
          errorMessage: error.error + ': ' + error.error_description
        });
      }
      return Promise.reject(error);
    });

    this.setState({
      userInfo: userInfo
    })
  }

  render() {
    const {userInfo, errorMessage} = this.state;
    errorMessage && (alert({errorMessage}));

    return userInfo ? (
        <View>
          {/*<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>*/}

            {/*<View style={{flex: 1, flexDirection: "row", alignSelf: "stretch"}}>*/}
              {/*<View style={{flex: 1, alignSelf: 'stretch'}}>*/}
                {/*<Text>Claim</Text>*/}
              {/*</View>*/}
              {/*<View style={{flex: 1, alignSelf: 'stretch'}}>*/}
                {/*<Text>Value</Text>*/}
              {/*</View>*/}
            {/*</View>*/}
            {/*<View style={{flex: 1, flexDirection: "row", alignSelf: "stretch"}}>*/}
            {/*{Object.keys(userInfo).map(key => (*/}
            {/*<View style={{flex: 1, alignSelf: 'stretch'}} key={key}>*/}
            {/*<Text>{key}</Text>*/}
            {/*<Text>{userInfo[key]}</Text>*/}
            {/*</View>*/}
            {/*))}*/}
            {/*</View>*/}
          {/*</View>*/}

          <Table borderStyle={{borderColor: 'transparent'}}>
            <Row data={Object.keys(userInfo)} />
            <Row data={Object.values(userInfo)} />

            {/*<Row data={['Claim', 'Value']}/>*/}
            {/*<TableWrapper>*/}
              {/*<Cols data={Object.keys(userInfo)}/>*/}
            {/*</TableWrapper>*/}
            {/*<TableWrapper>*/}
              {/*<Cols data={Object.values(userInfo)}/>*/}
            {/*</TableWrapper>*/}
            {/*<TableWrapper>*/}
            {/*<Col data={Object.keys(userInfo)}/>*/}
              {/*<Col data={Object.values(userInfo)}/>*/}
            {/*</TableWrapper>*/}

            {/*{*/}
              {/*Object.keys(userInfo).map( key=> {*/}
                {/*<TableWrapper key={key} >*/}
                  {/*{*/}
                    {/*rowData.map((cellData, cellIndex) => (*/}
                        {/*<Cell key={cellIndex} data={cellData}/>*/}
                    {/*))*/}
                  {/*}*/}
                {/*</TableWrapper>*/}
              {/*})*/}
              {/*userInfo.map((rowData, index) => (*/}

              {/*))*/}
            {/*}*/}
          </Table>

          <Button onPress={this.hideUserInfo} title="Hide User Information"/>
        </View>
    ) : (
        <View>
          <Button onPress={this.handleUserInfo} title="Show User Information"
          />
        </View>
    )
  }
}

export default UserInfo;
