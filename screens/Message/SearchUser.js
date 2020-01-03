import React, { useState } from "react";
import styled from "styled-components";
import useInput from "../../hooks/useInput";
import styles from "../../styles";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { TouchableOpacity } from "react-native";
import Loader from "../../components/Loader";
import ChatRoomBox from "../../navigation/ChatRoomBox";
import meChecker from "../../meChecker";

const SEARCH = gql`
  query searchUser($term: String!) {
    searchUser(term: $term) {
      avatar
      username
      isFollowing
      isSelf
      id
    }
  }
`;

const Constainer = styled.View`
  align-items: center;
  flex: 1;
`;

const TextInput = styled.TextInput`
  width: 90%;
  height: 40px;
  border-radius: 5;
  background-color: ${styles.lightGreyColor};
  padding-left: 10px;
  position: absolute;
  top: 10px;
`;

const UserContainer = styled.View`
  margin-top: 100px;
  align-items: center;
  justify-content: center;
`;

export default ({ navigation }) => {
  const searchInput = useInput("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const meData = meChecker();

  const { data, loading } = useQuery(SEARCH, {
    variables: {
      term: searchInput.value
    },
    skip: !shouldFetch
  });

  const onSubmit = () => {
    setShouldFetch(true);
  };

  return (
    <Constainer>
      <TextInput
        placeholder="대화 상대 검색"
        returnKeyType="send"
        value={searchInput.value}
        onChangeText={searchInput.onChange}
        onSubmitEditing={onSubmit}
      />
      {loading ? (
        <Loader />
      ) : (
        <UserContainer>
          {data &&
            data.searchUser &&
            data.searchUser.map(user => (
              <ChatRoomBox key={user.id} {...user} meId={meData.data.me.id} />
            ))}
        </UserContainer>
      )}
    </Constainer>
  );
};
