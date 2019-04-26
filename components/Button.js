import React from 'react';
import styled from 'styled-components/native';
import {
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

type Props = {
  text: string,
  color: string,
  onPress: () => any
};

const ButtonBox = styled.TouchableOpacity.attrs({ activeOpacity: 0.8 })`
  height: ${hp('5%')}; 
  flex: 1;
  margin: 3px;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.color ? props.color : '#696969'};
  borderRadius: 40;
`;

const ButtonText = styled.Text`
  color: white;
`;

const Button = ({ text, color, onPress }: Props) => (
  <ButtonBox onPress={onPress} color={color}>
    <ButtonText>{text}</ButtonText>
  </ButtonBox>
);

export default Button;
