import React from 'react';
import {CLAIMS_MAPPING} from '../api';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native'
import {Col, Table, Row, TableWrapper} from 'react-native-table-component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
/**
 * React component for displaying multiple json objects in a table format
 */
class Tables extends React.Component {

  render() {

    return this.props.data && this.props.data.length ? (
        <View style={this.props.style}>
          {this.props.data.map((userData, index) => {
                if (userData) {
                  if(userData.isLoading){
                    return <ActivityIndicator size="large" key={index} style={{flex:1}}/>
                  } else {
                    return <ScrollView horizontal={true} key={index} style={{flex:1, marginVertical: wp('3%'),
                      marginBottom: (this.props.orientation == 'portrait') ? 0
                          : hp('27%'),
                      marginHorizontal: hp('3.5%')}}>
                      <ScrollView>
                        <Table style={{flexDirection: 'row'}}
                               borderStyle={{borderColor: 'transparent'}}>
                          <TableWrapper>
                            <Row/>
                            <TableWrapper style={{flexDirection: 'row'}}>
                              <Col data={Object.keys(userData.body).map(
                                  header => CLAIMS_MAPPING[header]
                                      ? CLAIMS_MAPPING[header]
                                      : header)}
                                   style={styles.header} textStyle={styles.claims}/>
                              <Col data={Object.values(userData.body)}
                                   textStyle={styles.text}></Col>
                            </TableWrapper>
                          </TableWrapper>
                        </Table>
                      </ScrollView>
                    </ScrollView>
                  }
                }
              }
          )}
        </View>
    ) : (
        <View style={this.props.style}/>
    )
  }
}

export default Tables;

const styles = StyleSheet.create({
  claims: {textAlign: 'left', fontWeight: '600', fontSize: 15, color: 'white'},
  text: {textAlign: 'left', fontWeight: '600', fontSize: 15, color: '#C0C0C0'},
  header: { width: wp('50%') }
});
