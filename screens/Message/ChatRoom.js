import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import useInput from "../../hooks/useInput";
import styles from "../../styles";
import { KeyboardAvoidingView, Text } from "react-native";
import { useMutation, useSubscription, useQuery } from "@apollo/react-hooks";
import ChatTextBox from "../../components/ChatTextBox";

const SEND_MESSAGE = gql`
  mutation sendMessage($roomId: String, $message: String, $toId: String) {
    sendMessage(roomId: $roomId, message: $message, toId: $toId) {
      text
      from {
        id
        username
      }
      to {
        id
        username
      }
      room {
        id
      }
    }
  }
`;

const NEW_MESSAGE = gql`
  subscription newMessage($roomId: String!) {
    newMessage(roomId: $roomId) {
      id
      text
      from {
        id
        username
        avatar
      }
    }
  }
`;

const SEE_ROOM = gql`
  query seeRoom($roomId: String!) {
    seeRoom(roomId: $roomId) {
      participants {
        id
        username
        avatar
      }
      messages {
        id
        text
        from {
          id
          username
        }
        to {
          id
          username
        }
      }
    }
  }
`;

const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  padding-bottom: 10px;
`;

const MessageWrraper = styled.ScrollView`
  margin: 5px 0px;
  height: 400px;
  width: 90%;
  flex-direction: column;
  flex: 1;
  background-color: ${styles.blueColor};
  border-radius: 15px;
`;

const TextInput = styled.TextInput`
  width: 90%;
  height: 40px;
  border-radius: 15px;
  background-color: ${styles.lightGreyColor};
  padding-left: 10px;
  margin-bottom: 300px;
`;

export default ({ navigation }) => {
  const toId = navigation.getParam("id");
  const roomId = navigation.getParam("roomId");
  const messageInput = useInput("");

  const { data: roomInfo, loading: roomLoading, refetch } = useQuery(SEE_ROOM, {
    variables: {
      roomId
    }
  });

  const [messages, setMessages] = useState([]);
  //기존대화를 초기 messages로 설정
  const oldSettiong = () => {
    if (roomInfo) {
      setMessages([...roomInfo.seeRoom.messages]);
    }
  };

  const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
    variables: {
      toId,
      message: messageInput.value,
      roomId
    }
  });

  const { data } = useSubscription(NEW_MESSAGE, {
    variables: {
      roomId
    }
  });

  const scroll = useRef();
  const toBottom = () => {
    // 스크롤 바닥으로 내리기
    scroll.current.scrollToEnd();
  };

  const handleNewMessage = () => {
    if (data !== undefined) {
      const { newMessage } = data;
      setMessages(pre => [...pre, newMessage]);
    }
  };
  const onSubmit = async () => {
    if (messageInput.value === "") {
      return;
    }
    try {
      await sendMessageMutation();
    } catch (error) {
      console.log(error);
    } finally {
      messageInput.setValue("");
    }
  };

  useEffect(() => {
    handleNewMessage();
    refetch();
  }, [data]);

  useEffect(() => {
    toBottom(); // render, rerender 시 스크롤 바닥으로.
  });

  useEffect(() => {
    oldSettiong();
  }, []);

  return (
    <Container>
      <MessageWrraper ref={scroll}>
        {messages &&
          messages.map(m => (
            <ChatTextBox
              me={roomInfo.seeRoom.participants[0].id === m.from.id}
              key={m.id}
              message={m.text}
            />
          ))}
      </MessageWrraper>
      <TextInput
        placeholder="대화 입력"
        returnKeyType="send"
        value={messageInput.value}
        onChangeText={messageInput.onChange}
        onSubmitEditing={onSubmit}
        autoCorrect={false}
      />
    </Container>
  );
};
