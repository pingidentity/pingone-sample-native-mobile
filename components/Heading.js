import { Platform } from 'react-native';
import styled from 'styled-components/native';
import {
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const font = Platform.select({
  ios: 'GillSans-light',
  android: 'sans-serif-thin'
});

export default styled.Text` 
  color: #FFF5EE ;
  font-family: ${font};
  font-size: ${props => props.fontSize ? props.fontSize : hp('3%') };
  margin-top: ${props => props.marginTop ? props.marginTop : hp('1%') };
  margin-bottom: ${props => props.marginBottom ? props.marginBottom : '0' };
  margin-right: ${props => props.marginRight ? props.marginRight : '0' };
  background-color: transparent;
  text-align: ${props => props.textAlign ? props.textAlign : 'center' };
  flex: 1;
`;
