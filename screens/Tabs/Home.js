import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { ScrollView, RefreshControl } from "react-native";
import Loader from "../../components/Loader";
import Post from "../../components/Post";
import { POST_FRAGMENT } from "../../fragment";

//uploadPhoto.js에서 밑의 쿼리 재사용
export const FEED_QUERY = gql`
  {
    seeFeed {
      ...PostParts
    }
  }
  ${POST_FRAGMENT}
`;

export default () => {
  const [refreshing, setRefreshing] = useState(false); //새로고침여부 저장
  const { loading, data, refetch } = useQuery(FEED_QUERY);

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

  useEffect(() => {
    refetch();
  });

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }
    >
      {loading ? (
        <Loader />
      ) : (
        data &&
        data.seeFeed &&
        data.seeFeed.map(post => <Post key={post.id} {...post} />)
      )}
    </ScrollView>
  );
};
