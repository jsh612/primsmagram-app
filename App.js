import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, View, AsyncStorage, TouchableOpacity } from "react-native";
import { AppLoading } from "expo"; // 로딩 작업을 실시하는 컴포넌트
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { ThemeProvider } from "styled-components";

import apolloClientOptions from "./apollo";
import styles from "./styles";

export default function App() {
  const [loaded, setLoaded] = useState(false); // 로딩 상태 확인 state
  const [client, setClient] = useState(null); // client 생성 여부 확인 state

  // #로그인, 로그아웃 여부 확인
  // -null: 아직 확인전 , -false: 로그인안됨, -true: 로그인된 상태
  // (null 의 이유: 아직 확인 하지 않은 경우를 포함 시키기 위해)
  const [isLoggedIn, setisLoggedIn] = useState(null);

  // #preLoad 함수
  //  - 앱이 실행될 때 먼저 로드 되야할 것들을 모아놓은 함수
  const preLoad = async () => {
    try {
      // #font를 preload
      await Font.loadAsync({
        ...Ionicons.font // Ionicons 가 expose 되는 방식
      });

      // #이미지 등 asset prload
      await Asset.loadAsync([require("./assets/instaLogo.jpeg")]); //

      // #메모리 캐시 생성 후 persist로 저장 시키기
      const cache = new InMemoryCache();
      await persistCache({
        cache,
        storage: AsyncStorage // 웹의 LocalStorage 같은 것 (차이점: 이것은 비동기)
      });

      // #ApolloClient 생성
      const client = new ApolloClient({
        // ApolloClient 환경설정
        //  - https://www.apollographql.com/docs/react/get-started/#configuration-options
        cache,
        ...apolloClientOptions
      });

      // #로그인 여부 설정
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn"); //AsyncStorage 에서 해당 값 가져오기
      if (isLoggedIn === null || isLoggedIn === "false") {
        setisLoggedIn(false);
      } else {
        setisLoggedIn(true);
      }

      // setLoaded, setCliet를 통해 위의 코드들 실행 완료 표시
      setLoaded(true);
      setClient(client);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    preLoad();
  }, []);

  const logUserIn = async () => {
    console.log("in");
    try {
      await AsyncStorage.setItem("isLoggedIn", "true"); //key value 모두 string
      setisLoggedIn(false);
    } catch (error) {
      console.log(error);
    }
  };

  const logUserOut = async () => {
    console.log("out");
    try {
      await AsyncStorage.setItem("isLoggedIn", "false"); //key value 모두 string
      setisLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
  };

  return loaded && client && isLoggedIn !== null ? (
    <ApolloProvider client={client}>
      <ThemeProvider theme={styles}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {isLoggedIn === true ? (
            <TouchableOpacity onPress={logUserIn}>
              <Text>로그인 했다.</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={logUserOut}>
              <Text>로그아웃 했다.</Text>
            </TouchableOpacity>
          )}
        </View>
      </ThemeProvider>
    </ApolloProvider>
  ) : (
    <AppLoading />
  );
}
