import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Text, TouchableOpacity } from "react-native";
import { withNavigation } from "react-navigation";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

const SEND_MESSAGE = gql`
  mutation sendMessage($roomId: String, $message: String, $toId: String) {
    sendMessage(roomId: $roomId, message: $message, toId: $toId) {
      text
      from {
        id
      }
      to {
        id
      }
      room {
        id
      }
    }
  }
`;

const Container = styled.View`
  margin: 20px 0;
  flex-direction: row;
  align-items: center;
`;

const ImageWrapper = styled.View`
  margin-left: 10px;
`;

const Image = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 20px;
`;

const Username = styled.Text`
  font-weight: 600;
  margin-left: 10px;
  font-size: 20px;
  width: 70%;
`;

const SearchUserBox = ({ id, username, avatar, navigation }) => {
  const [refresh, setRefresh] = useState("");

  const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
    variables: {
      toId: id,
      message: ""
    }
  });

  const onPress = async () => {
    const {
      data: { sendMessage }
    } = await sendMessageMutation();
    setRefresh(sendMessage.id);
    navigation.navigate("ChatRoom", {
      id,
      roomId: sendMessage.room.id
    });
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Container>
        <ImageWrapper>
          <Image source={{ uri: avatar }} />
        </ImageWrapper>
        <Username>{username}</Username>
      </Container>
    </TouchableOpacity>
  );
};

SearchUserBox.propTypes = {
  username: PropTypes.string.isRequired,
  avatar: PropTypes.string
};

export default withNavigation(SearchUserBox);
