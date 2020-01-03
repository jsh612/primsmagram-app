import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Platform, RefreshControl } from "react-native";
import ChatRoomBox from "../../navigation/ChatRoomBox";
import NavIcon from "../../components/NavIcon";
import Loader from "../../components/Loader";
import meChecker from "../../meChecker";

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
  const meData = meChecker();

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
              data.seeRooms.map(room => {
                const otherUser = room.participants.filter(
                  v => v.id !== meData.data.me.id
                )[0];
                return (
                  <ChatRoomBox
                    key={room.id}
                    meId={meData.data.me.id}
                    {...otherUser}
                  />
                );
              })}
          </RoomContainer>
        </>
      )}
    </Container>
  );
};

export default SeeRoom;
