import React, { useState } from "react";
import { View, Text } from "react-native";
import styled from "styled-components";
import { gql } from "apollo-boost";
import useInput from "../../hooks/useInput";
import { useMutation } from "@apollo/react-hooks";
import { FEED_QUERY } from "./Home";

const ADD_COMMENT = gql`
  mutation addComment($text: String!, $postId: String!) {
    addComment(text: $text, postId: $postId) {
      id
      text
    }
  }
`;

const Container = styled.KeyboardAvoidingView`
  flex: 1;
  justify-content: center;
  margin-left: 30px;
`;

const CommentContainer = styled.View`
  flex-direction: row;
`;

const Bold = styled.Text`
  font-weight: 500;
  font-size: 30px;
`;

const CommentText = styled.Text`
  margin-left: 15px;
  font-size: 30px;
`;

const CommInput = styled.TextInput`
  margin-top: 50;
  width: 90%;
  border-radius: 10;
`;

const Comment = ({ navigation }) => {
  const comment = useInput("");

  const commments = navigation.getParam("comm");
  const postId = navigation.getParam("postId");
  console.log("postId ::", postId);

  const [addCommentMutation] = useMutation(ADD_COMMENT, {
    variables: {
      postId,
      text: comment.value
    }
  });

  const onSubmit = async () => {
    if (comment.value === "") {
      return;
    }
    try {
      await addCommentMutation({
        refetchQueries: () => [{ query: FEED_QUERY }]
      });
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container enabled behavior="padding">
      {commments &&
        commments.map(comm => (
          <CommentContainer key={comm.id}>
            <Bold>{comm.user.username}</Bold>
            <CommentText>{comm.text}</CommentText>
          </CommentContainer>
        ))}
      <CommInput
        placeholder="댓글 작성"
        style={{
          marginTop: 50,
          width: "90%",
          borderRadius: 10,
          paddingVertical: 15,
          paddingHorizontal: 10,
          backgroundColor: "#f2f2f2"
        }}
        returnKeyType="send"
        value={comment.value}
        onChangeText={comment.onChange}
        onSubmitEditing={onSubmit}
      />
    </Container>
  );
};

export default Comment;
