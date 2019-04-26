import styled from 'styled-components/native';

export default styled.ImageBackground.attrs({
  source: require('../assets/background-new.png'),
  imageStyle: {opacity: 0.4}
})`
  flex: 1;
  background-color: black;
  padding: 40px 10px 10px 10px;
`;
