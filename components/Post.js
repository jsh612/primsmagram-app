import React, { useState } from "react";
import { Image, Platform } from "react-native";
import PropTypes from "prop-types";
import styled from "styled-components";
import Swiper from "react-native-swiper";
import { Ionicons } from "@expo/vector-icons";
import { gql } from "apollo-boost";
import constants from "../constants";
import { useMutation } from "@apollo/react-hooks";
import { withNavigation } from "react-navigation";
import styles from "../styles";

export const TOGGLE_LIKE = gql`
  mutation toggelLike($postId: String!) {
    toggleLike(postId: $postId)
  }
`;

const Container = styled.View`
  margin-bottom: 40px;
`;

const Header = styled.View`
  padding: 15px;
  flex-direction: row;
  align-items: center;
`;

const Touchable = styled.TouchableOpacity``;

const HeaderUserContainer = styled.View`
  margin-left: 10px;
`;

const Bold = styled.Text`
  font-weight: 500;
`;

const Location = styled.Text`
  font-size: 12px;
`;

const IconsContainer = styled.View`
  padding: 10px;
  padding-bottom: 0;
  flex-direction: row;
`;

const IconContainer = styled.View`
  margin-right: 10px;
`;

const InfoContainer = styled.View`
  padding: 5px 10px;
`;

const Caption = styled.Text`
  margin: 3px 0px;
`;

const CommentCount = styled.Text`
  opacity: 0.5;
  font-size: 13px;
  margin: 5px 0;
  margin-left: -3px;
`;

const CommentContainer = styled.View`
  flex-direction: row;
`;

const CommentText = styled.Text`
  margin-left: 5px;
`;

const Post = ({
  id,
  user,
  location,
  files = [],
  likeCount: likeCountProp,
  caption,
  comments,
  isLiked: isLikedProp,
  navigation
}) => {
  const [commnetView, setCommnetView] = useState(false);
  const [isLiked, setIsLiked] = useState(isLikedProp);
  const [likeCount, setIsLikeCount] = useState(likeCountProp);

  const handleComment = () => {
    return commnetView ? setCommnetView(false) : setCommnetView(true);
  };

  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE, {
    variables: {
      postId: id
    }
  });

  const handleLike = async () => {
    if (isLiked) {
      setIsLikeCount(l => l - 1);
    } else {
      setIsLikeCount(l => l + 1);
    }
    setIsLiked(like => !like);
    try {
      await toggleLikeMutation();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Header>
        <Touchable
          onPress={() =>
            navigation.navigate("UserDetail", { username: user.username })
          }
        >
          <Image
            source={{ uri: user.avatar }}
            style={{ height: 40, width: 40, borderRadius: 20 }}
          />
        </Touchable>
        <Touchable
          onPress={() =>
            navigation.navigate("UserDetail", { username: user.username })
          }
        >
          <HeaderUserContainer>
            <Bold>{user.username}</Bold>
            <Location>{location}</Location>
          </HeaderUserContainer>
        </Touchable>
      </Header>
      <Swiper style={{ height: constants.height / 2.5 }}>
        {files.map(file => (
          <Image
            style={{ width: constants.width, height: constants.height / 2.5 }}
            key={file.id}
            source={{ uri: file.url }}
          />
        ))}
      </Swiper>
      <IconsContainer>
        <Touchable onPress={handleLike}>
          <IconContainer>
            <Ionicons
              size={28}
              color={isLiked ? styles.redColor : styles.blackColor}
              name={
                Platform.OS === "ios"
                  ? isLiked
                    ? "ios-heart"
                    : "ios-heart-empty"
                  : isLiked
                  ? "md-heart"
                  : "md-heart-empty"
              }
            />
          </IconContainer>
        </Touchable>
        <Touchable>
          <IconContainer>
            <Ionicons
              size={28}
              color={styles.blackColor}
              name={Platform.OS === "ios" ? "ios-text" : "md-text"}
            />
          </IconContainer>
        </Touchable>
      </IconsContainer>
      <InfoContainer>
        <Touchable>
          <Bold>
            {likeCount === 1 ? "좋아요 1개" : `좋아요 ${likeCount}개`}
          </Bold>
        </Touchable>
        <Touchable>
          <Caption>
            <Bold>{user.username}</Bold> {caption}
          </Caption>
        </Touchable>
        <Touchable onPress={handleComment}>
          <CommentCount> 댓글 {comments.length}개 모두 보기</CommentCount>
        </Touchable>
        {comments &&
          commnetView &&
          comments.map(comm => (
            <CommentContainer key={comm.id}>
              <Bold>{comm.user.username}</Bold>
              <CommentText>{comm.text}</CommentText>
            </CommentContainer>
          ))}
      </InfoContainer>
    </Container>
  );
};

Post.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired
  }).isRequired,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  likeCount: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired
      }).isRequired
    })
  ).isRequired,
  caption: PropTypes.string.isRequired,
  location: PropTypes.string,
  createdAt: PropTypes.string.isRequired
};

export default withNavigation(Post);
