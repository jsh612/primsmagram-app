import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AsyncStorage } from "react-native";
import { AppLoading } from "expo"; // 로딩 작업을 실시하는 컴포넌트
import * as Font from "expo-font";
import { Asset } from "expo-asset";
// import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
// import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { ThemeProvider } from "styled-components";

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { setContext } from "apollo-link-context";
import { getMainDefinition } from "apollo-utilities";

// import apolloClientOptions from "./apollo";
import styles from "./styles";
import NavController from "./components/NavController";
import { AuthProvider } from "./AuthContext";

export default function App() {
  const [loaded, setLoaded] = useState(false); // 로딩 상태 확인 state
  const [client, setClient] = useState(null); // client 생성 여부 확인 state
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // #preLoad 함수
  //  - 앱이 실행될 때 먼저 로드 되야할 것들을 모아놓은 함수
  const preLoad = async () => {
    //강제로 로그아웃 시키기 임시 코드
    //await AsyncStorage.clear()
    try {
      // #font를 preload
      await Font.loadAsync({
        ...Ionicons.font // Ionicons 가 expose 되는 방식
      });

      // #이미지 등 asset prload
      await Asset.loadAsync([require("./assets/main_logo.png")]); //

      // #메모리 캐시 생성 후 persist로 저장 시키기
      const cache = new InMemoryCache();
      await persistCache({
        cache,
        storage: AsyncStorage // 웹의 LocalStorage 같은 것 (차이점: 이것은 비동기)
      });

      // #ApolloClient 생성
      // const client = new ApolloClient({
      //   // ApolloClient 환경설정
      //   //  - https://www.apollographql.com/docs/react/get-started/#configuration-options
      //   cache,
      //   ...apolloClientOptions
      // });
      const httpLink = new HttpLink({
        // link는 아폴로가 데이터를 방는 방식
        uri: "http://localhost:4000"
      });

      const wsLink = new WebSocketLink({
        // link는 아폴로가 데이터를 방는 방식
        uri: `ws://localhost:4000/`,
        options: {
          reconnect: true
        }
      });

      const authLink = setContext(async (_, { headers }) => {
        // get the authentication token from local storage if it exists
        const token = await AsyncStorage.getItem("jwt");
        // return the headers to the context so httpLink can read them
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ""
          }
        };
      });

      const client = new ApolloClient({
        link: ApolloLink.from([
          onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
              graphQLErrors.forEach(({ message, locations, path }) =>
                console.log(
                  `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                )
              );
            if (networkError) console.log(`[Network error]: ${networkError}`);
          }),
          split(
            // 명령문이 subscrion인지 아닌지에 따라 WsLink 와 httpLink 중 하나를 선택한다.
            ({ query }) => {
              const definition = getMainDefinition(query);
              return (
                definition.kind === "OperationDefinition" &&
                definition.operation === "subscription"
              );
            },
            authLink.concat(wsLink),
            authLink.concat(httpLink)
          )
        ]),
        cache
      });

      // #로그인 여부 설정
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn"); //AsyncStorage 에서 해당 값 가져오기
      if (isLoggedIn === null || isLoggedIn === "false") {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
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

  return loaded && client && isLoggedIn !== null ? (
    <ApolloProvider client={client}>
      <ThemeProvider theme={styles}>
        <AuthProvider isLoggedIn={isLoggedIn}>
          <NavController />
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  ) : (
    <AppLoading />
  );
}
