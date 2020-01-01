import React, { useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import PropTypes from "prop-types";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import Loader from "../../../components/Loader";
import SquarePhoto from "../../../components/SquarePhoto";
import styled from "styled-components";
import constants from "../../../constants";

export const SEARCH = gql`
  query search($term: String!) {
    searchPost(term: $term) {
      id
      files {
        id
        url
      }
      likeCount
      commentCount
    }
  }
`;

const Container = styled.View`
  flex-direction: row;
  flex: 1;
  flex-wrap: wrap;
`;

const SearchPresenter = ({ term, shouldFetch }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery(SEARCH, {
    variables: {
      term
    },
    skip: !shouldFetch, // shoudeFetch가 true 경우에만 실행시킨다.
    //# fetchPolicy
    //:  https://www.apollographql.com/docs/react/api/react-hoc/#graphql-options-for-queries
    fetchPolicy: "network-only"
  });

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      // # useQuery - refetch()
      // - You can optionally provide a new variables object to the refetch function. If you don't,
      //   the query uses the same variables that it used in its previous execution.
      // - https://www.apollographql.com/docs/react/data/queries/#refetching
      await refetch();
    } catch (e) {
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
      }
    >
      {loading ? (
        <Loader />
      ) : (
        <Container>
          {data &&
            data.searchPost &&
            data.searchPost.map(post => (
              <SquarePhoto
                key={post.id}
                style={{ width: constants.width / 3 }}
                {...post}
              />
            ))}
        </Container>
      )}
    </ScrollView>
  );
};

SearchPresenter.propTypes = {
  term: PropTypes.string.isRequired,
  shouldFetch: PropTypes.bool.isRequired
};

export default SearchPresenter;
