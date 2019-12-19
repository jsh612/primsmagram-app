import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import constants from "../constants";
import { ActivityIndicator } from "react-native";

const Touchable = styled.TouchableOpacity``;

const Container = styled.View`
  background-color: ${props =>
    props.bgColor ? props.bgColor : props.theme.blueColor};
  padding: 10px;
  margin: 0px 50px;
  border-radius: 4px;
  width: ${constants.width / 1.7};
`;

const Text = styled.Text`
  color: white;
  text-align: center;
  font-weight: 600;
`;

const AuthButton = ({ text, onPress, loading = false, bgColor = null }) => (
  //# disabled
  //  - 로딩중일 경우 컴포넌트와의 상호작용 기능을 끊기 위해
  //  - https://facebook.github.io/react-native/docs/touchablewithoutfeedback#disabled
  <Touchable disabled={loading} onPress={onPress}>
    <Container bgColor={bgColor}>
      {/* ActivityIndicator -> 로딩 표시 나타냄 */}
      {loading ? <ActivityIndicator color={"white"} /> : <Text>{text}</Text>}
    </Container>
  </Touchable>
);

AuthButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default AuthButton;
