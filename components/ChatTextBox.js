import React from "react";
import styled from "styled-components";
import styles from "../styles";

const Text = styled.Text`
  margin: 10px;
  margin-left: ${props => (props.me ? "10px" : "0")};
  margin-right: ${props => (props.me ? "0" : "30")};
  text-align: ${props => (props.me ? "right" : "left")};
  margin: 10px;
  color: white;
  font-size: 20px;
  font-weight: 600;
`;

const ChatTextBox = ({ message, me }) => {
  return <Text me={me}>{message}</Text>;
};

export default ChatTextBox;
