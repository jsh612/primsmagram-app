import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Platform, RefreshControl } from "react-native";
import SearchUserBox from "../../navigation/SearchUserBox";
import NavIcon from "../../components/NavIcon";
import Loader from "../../components/Loader";

const SEE_ROOMS = gql`
  query seeRooms {
    seeRooms {
      id
      participants {
        username
        id
        avatar
      }
    }
  }
`;

const Container = styled.ScrollView`
  margin: 10px;
  padding: 5px;
`;

const Touchable = styled.TouchableOpacity`
  width: 100px;
  margin: 20px 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Text = styled.Text`
  width: 120px;
  font-size: 15px;
  font-weight: 600;
  margin-left: 5px;
`;

const RoomContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const SeeRoom = ({ navigation }) => {
  const { data, loading, refetch } = useQuery(SEE_ROOMS);
  const [refreshing, setRefreshing] = useState(false);

  const onPress = () => navigation.navigate("SearchUser");

  const refresh = async () => {
    try {
      setRefreshing(true);
      refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);
  return (
    <Container
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <Touchable onPress={onPress}>
            <NavIcon
              size={26}
              name={
                Platform.OS === "ios"
                  ? "ios-add-circle-outline"
                  : "md-add-circle-outline"
              }
            />
            <Text>추가</Text>
          </Touchable>
          <RoomContainer>
            {data &&
              data.seeRooms &&
              data.seeRooms.map(room => (
                <SearchUserBox key={room.id} {...room.participants[1]} />
              ))}
          </RoomContainer>
        </>
      )}
    </Container>
  );
};

export default SeeRoom;
