import React, { useState, useEffect } from "react";
import { TouchableOpacity, Platform } from "react-native";
import styled from "styled-components";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../../components/Loader";
import constants from "../../constants";

const View = styled.View`
  flex: 1;
`;

const Icon = styled.View``;

export default ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [hasPermisson, setHasPermisson] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);

  const askPermission = async () => {
    // 카메라 접근 권한 받기
    try {
      const { status } = await Camera.requestPermissionsAsync();
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

  useEffect(() => {
    askPermission();
  }, []);

  return (
    <View>
      {loading ? (
        <Loader />
      ) : hasPermisson ? (
        <Camera
          style={{
            width: constants.width,
            height: constants.height / 2,
            justifyContent: "flex-end",
            padding: 15
          }}
          type={cameraType}
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
      ) : null}
    </View>
  );
};
