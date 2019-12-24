import React from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { ScrollView } from "react-native";
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
  const { loading, data } = useQuery(ME);
  console.log("me::", data);
  return (
    <ScrollView>
      {loading ? <Loader /> : data && data.me && <UserProfile {...data.me} />}
    </ScrollView>
  );
};
