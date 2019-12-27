import React, { useState } from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { ScrollView, RefreshControl } from "react-native";
import { USER_FRAGMENT } from "../../fragment";
import { useQuery } from "@apollo/react-hooks";
import Loader from "../../components/Loader";
import UserProfile from "../../components/UserProfile";

export const ME = gql`
  query me {
    me {
      ...UserParts
    }
  }
  ${USER_FRAGMENT}
`;

export default ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false); //새로고침여부 저장
  const { loading, data, refetch } = useQuery(ME);

  const refresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }
    >
      {loading ? <Loader /> : data && data.me && <UserProfile {...data.me} />}
    </ScrollView>
  );
};
