import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { AppLoading } from "expo"; // 로딩 작업을 실시하는 컴포넌트
import * as Font from "expo-font";
import { Asset } from "expo-asset";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const preLoad = async () => {
    try {
      await Font.loadAsync({
        //font를 preload
        ...Ionicons.font
      });
      await Asset.loadAsync([require("./assets/instaLogo.jpeg")]);
      setLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    preLoad();
  }, []);
  return loaded ? (
    <View>
      <Text>앱이 실행 되었습니다</Text>
    </View>
  ) : (
    <AppLoading />
  );
}
