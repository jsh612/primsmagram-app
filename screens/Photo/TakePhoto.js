import React, { useState, useEffect, useRef } from "react";
import { TouchableOpacity, Platform } from "react-native";
import styled from "styled-components";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import Loader from "../../components/Loader";
import constants from "../../constants";
import styles from "../../styles";

const View = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.View``;

const Button = styled.View`
  width: 80;
  height: 80;
  border-radius: 40px;
  border: 10px solid ${styles.lightGreyColor};
`;

export default ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [hasPermisson, setHasPermisson] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);

  // #cameraRef --> Camera 의 메소드를 사용하기 위해선 다음과 같이 ref 이용
  //  - https://docs.expo.io/versions/v36.0.0/sdk/camera/#methods
  const cameraRef = useRef();
  const [canTakePhoto, setCanTakePhoto] = useState(true);

  const askPermission = async () => {
    // 카메라 접근 권한 받기
    try {
      // const { status } = await Camera.requestPermissionsAsync();
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status === "granted") {
        setHasPermisson(true);
      }
    } catch (error) {
      console.log(error);
      setHasPermisson(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleType = () => {
    // 카메라 전,후면 전환
    if (cameraType === Camera.Constants.Type.front) {
      setCameraType(Camera.Constants.Type.back);
    } else {
      setCameraType(Camera.Constants.Type.front);
    }
  };

  const takePhoto = async () => {
    if (!canTakePhoto) {
      return;
    }
    try {
      setCanTakePhoto(false);
      const { uri } = await cameraRef.current.takePictureAsync({
        quality: 1
      });
      const asset = await MediaLibrary.createAssetAsync(uri);
      navigation.navigate("Upload", { photo: asset });
    } catch (error) {
      console.log(error);
    } finally {
      setCanTakePhoto(true);
    }
  };

  useEffect(() => {
    askPermission();
  }, []);

  return (
    <View>
      {loading ? (
        <Loader />
      ) : hasPermisson ? (
        <>
          <Camera
            style={{
              width: constants.width,
              height: constants.height / 2,
              justifyContent: "flex-end",
              padding: 15
            }}
            type={cameraType}
            ref={cameraRef}
          >
            <TouchableOpacity onPress={toggleType}>
              <Icon>
                <Ionicons
                  name={
                    Platform.OS === "ios"
                      ? "ios-reverse-camera"
                      : "md-reverse-camera"
                  }
                  size={32}
                  color={"white"}
                />
              </Icon>
            </TouchableOpacity>
          </Camera>
          <View>
            <TouchableOpacity onPress={takePhoto} disabled={!canTakePhoto}>
              <Button />
            </TouchableOpacity>
          </View>
        </>
      ) : null}
    </View>
  );
};
