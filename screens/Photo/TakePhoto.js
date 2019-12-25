import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components";
import { Camera } from "expo-camera";
import Loader from "../../components/Loader";
import constants from "../../constants";

const View = styled.View`
  flex: 1;
`;

export default ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [hasPermisson, setHasPermisson] = useState(false);

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

  useEffect(() => {
    askPermission();
  }, []);

  return (
    <View>
      {loading ? (
        <Loader />
      ) : hasPermisson ? (
        <Camera
          style={{ width: constants.width, height: constants.height / 2 }}
        />
      ) : null}
    </View>
  );
};
