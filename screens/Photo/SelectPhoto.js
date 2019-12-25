import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import { Image } from "react-native";
import Loader from "../../components/Loader";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export default () => {
  const [loading, setLoading] = useState(true);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [seleted, setSeleted] = useState();
  const [allPhotos, setAllPhotos] = useState();

  const getPhotos = async () => {
    // 권한 얻은 후, 사진첩에서 사진 가져오기
    try {
      const { assets } = await MediaLibrary.getAssetsAsync();
      const [firstPhoto] = assets;
      setSeleted(firstPhoto);
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
      console.log("status:", status);
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
            <Image
              source={{ uri: seleted.uri }}
              style={{ width: 100, height: 100 }}
            />
          ) : null}
        </View>
      )}
    </View>
  );
};
