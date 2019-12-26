import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import { ScrollView, RefreshControl } from "react-native";
import Loader from "../../components/Loader";
import constants from "../../constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import styles from "../../styles";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Image = styled.Image`
  margin: 1px;
`;

const Button = styled.TouchableOpacity`
  width: 100px;
  height: 30px;
  position: absolute;
  right: 5px;
  top: 15px;
  background-color: ${styles.blueColor};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const Text = styled.Text`
  color: white;
  font-weight: 600;
`;

export default ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [seleted, setSelected] = useState();
  const [allPhotos, setAllPhotos] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const changeSelected = photo => {
    setSelected(photo);
  };

  const getPhotos = async () => {
    // 권한 얻은 후, 사진첩에서 사진 가져오기
    try {
      const { assets } = await MediaLibrary.getAssetsAsync();
      const [firstPhoto] = assets;
      setSelected(firstPhoto);
      setAllPhotos(assets);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const askPermission = async () => {
    //사진첩에 대한 권한 얻기
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === "granted") {
        setHasPermissions(true);
        // 권한을 얻은 후, 사진 가져오기
        getPhotos();
      }
    } catch (error) {
      console.log(error);
      setHasPermissions(false);
    }
  };

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSelected = () => {
    navigation.navigate("Upload", { photo: seleted });
  };

  useEffect(() => {
    askPermission();
  }, []);

  return (
    <View>
      {loading ? (
        <Loader />
      ) : (
        <View>
          {hasPermissions ? (
            <>
              <Image
                source={{ uri: seleted.uri }}
                style={{
                  width: constants.width,
                  height: constants.height / 2.5
                }}
              />
              <Button onPress={handleSelected}>
                <Text>업로드</Text>
              </Button>
              <ScrollView
                contentContainerStyle={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between"
                }}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={refresh} />
                }
              >
                {allPhotos.map(photo => (
                  <TouchableOpacity
                    key={photo.id}
                    onPress={() => changeSelected(photo)}
                  >
                    <Image
                      source={{ uri: photo.uri }}
                      style={{
                        width: constants.width / 3.05,
                        height: constants.height / 6,
                        opacity: photo.id === seleted.id ? 0.5 : 1
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          ) : null}
        </View>
      )}
    </View>
  );
};
