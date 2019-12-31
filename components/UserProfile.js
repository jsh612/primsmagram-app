import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Image, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "@unimodules/core";
import styles from "../styles";
import constants from "../constants";
import SquarePhoto from "./SquarePhoto";
import Post from "./Post";
import { useLogOut } from "../AuthContext";

const ProfileHeader = styled.View`
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const HeaderColumn = styled.View``;

const ProfileStats = styled.View`
  flex-direction: row;
`;

const Stat = styled.View`
  align-items: center;
  margin-left: 40px;
`;

const Bold = styled.Text`
  font-weight: 600;
  font-size: 16px;
`;

const StatName = styled.Text`
  margin-top: 5px;
  font-size: 12px;
  color: ${styles.darkGreyColor};
`;

const ProfileMeta = styled.View`
  margin-top: 10px;
  padding-left: 20px;
`;

const Bio = styled.Text`
  margin-top: 10px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  margin-top: 30px;
  padding: 5px 0px;
  border: 1px solid ${styles.lightGreyColor};
`;

const Button = styled.View`
  width: ${constants.width / 2};
  align-items: center;
`;

const SquareContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const Logout = styled.TouchableOpacity`
  background-color: ${styles.blueColor};
  width: 80px;
  height: 20px;
  margin-top: -20px;
  align-items: center;
  justify-content: center;
`;

const LogoutText = styled.Text`
  color: white;
  font-weight: 800;
`;

const UserProfile = ({
  avatar,
  postsCount,
  followersCount,
  followingCount,
  bio,
  fullName,
  posts,
  okMe
}) => {
  console.log("나인지여부", okMe);
  const [isGrid, setIsGrid] = useState(true);
  const toggleGrid = () => setIsGrid(true);
  const toggleList = () => setIsGrid(false);
  const logOut = useLogOut();
  return (
    <View>
      <ProfileHeader>
        <Image
          style={{ height: 80, width: 80, borderRadius: 40 }}
          source={{ uri: avatar }}
        />
        <HeaderColumn>
          <ProfileStats>
            <Stat>
              <Bold>{postsCount}</Bold>
              <StatName>Posts</StatName>
            </Stat>
            <Stat>
              <Bold>{followersCount}</Bold>
              <StatName>Followers</StatName>
            </Stat>
            <Stat>
              <Bold>{followingCount}</Bold>
              <StatName>Following</StatName>
            </Stat>
          </ProfileStats>
        </HeaderColumn>
      </ProfileHeader>
      <ProfileMeta>
        {okMe && (
          <Logout onPress={logOut}>
            <LogoutText>로그아웃</LogoutText>
          </Logout>
        )}
        <Bold>{fullName}</Bold>
        <Bio>{bio}</Bio>
      </ProfileMeta>
      <ButtonContainer>
        <TouchableOpacity onPress={toggleGrid}>
          <Button>
            <Ionicons
              size={32}
              name={Platform.OS === "ios" ? "ios-grid" : "md-grid"}
              color={isGrid ? styles.blackColor : styles.lightGreyColor}
            />
          </Button>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleList}>
          <Button>
            <Ionicons
              size={32}
              name={Platform.OS === "ios" ? "ios-list" : "md-list"}
              color={!isGrid ? styles.blackColor : styles.lightGreyColor}
            />
          </Button>
        </TouchableOpacity>
      </ButtonContainer>
      <SquareContainer>
        {posts &&
          posts.map(p => (isGrid ? <SquarePhoto key={p.id} {...p} /> : null))}
      </SquareContainer>
      {posts && posts.map(p => (isGrid ? null : <Post key={p.id} {...p} />))}
    </View>
  );
};

UserProfile.propTypes = {
  id: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  isFollowing: PropTypes.bool.isRequired,
  isSelf: PropTypes.bool.isRequired,
  bio: PropTypes.string.isRequired,
  followingCount: PropTypes.number.isRequired,
  followersCount: PropTypes.number.isRequired,
  postsCount: PropTypes.number.isRequired,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  )
};
export default UserProfile;
