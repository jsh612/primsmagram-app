import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, View, AsyncStorage } from "react-native";
import { AppLoading } from "expo"; // 로딩 작업을 실시하는 컴포넌트
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

import apolloClientOptions from "./apollo";

export default function App() {
  const [loaded, setLoaded] = useState(false); // 로딩 상태 확인 state
  const [client, setClient] = useState(null); // client 관련 state

  const preLoad = async () => {
    try {
      await Font.loadAsync({
        //font를 preload
        ...Ionicons.font
      });
      await Asset.loadAsync([require("./assets/instaLogo.jpeg")]); // 이미지 등 prload

      const cache = new InMemoryCache(); // 메모리 캐시 생성
      await persistCache({
        cache,
        storage: AsyncStorage
      });
      const client = new ApolloClient({
        // #ApolloClient 환경설정
        //  - https://www.apollographql.com/docs/react/get-started/#configuration-options
        cache,
        ...apolloClientOptions
      });

      setLoaded(true);
      setClient(client);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    preLoad();
  }, []);
  return loaded && client ? (
    <ApolloProvider client={client}>
      <View>
        <Text>앱이 실행 되었습니다</Text>
      </View>
    </ApolloProvider>
  ) : (
    <AppLoading />
  );
}
