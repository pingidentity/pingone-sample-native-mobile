import styled from 'styled-components/native';

export default styled.View`
  flex: 1;
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${props => props.bottom ? props.bottom : 0 };
  align-self:  ${props => props.alignSelf ? props.alignSelf : 'flex-end'};
  flex-direction: ${ props => props.flexDirection ? props.flexDirection :  'row'};
  margin: 10px;
  ${props => props.width ? props.width :'' };
`;
