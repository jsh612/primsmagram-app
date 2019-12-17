import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import Home from "../screens/Tabs/Home";
import Search from "../screens/Tabs/Search";
import Notifications from "../screens/Tabs/Notifications";
import Profile from "../screens/Tabs/Profile";
import { View } from "react-native";
import MessagesLink from "../components/MessagesLink";

const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator({
    InitialRoute: {
      screen: initialRoute,
      navigationOptions: { ...customConfig }
    }
  });

export default createBottomTabNavigator({
  // # route 정하는거랑 비슷
  // # Tab 에 Stack 넣기
  //   https://reactnavigation.org/docs/en/tab-based-navigation.html#a-stack-navigator-for-each-tab
  Home: {
    screen: stackFactory(Home, {
      title: "Home",
      headerRight: <MessagesLink />
    })
  },
  Search: {
    screen: stackFactory(Search, {
      title: "Search"
    })
  },
  ADD: {
    screen: View, // 가짜 스크린
    // # navigationOptions은 "객체" 또는 "옵션객체를 출력하는 함수"
    //  - https://reactnavigation.org/docs/en/headers.html#setting-the-header-title
    //  - 함수로 작성시 예시
    //    navigationOptions: () => ({
    //      tabBarOnPress: ({navigation}) => navigation.navigate("PhotoNavigation")
    //    })
    navigationOptions: {
      // https://reactnavigation.org/docs/en/material-bottom-tab-navigator.html#tabbaronpress
      tabBarOnPress: ({ navigation }) => navigation.navigate("PhotoNavigation")
    }
  },
  Notifications: {
    screen: stackFactory(Notifications, {
      title: "Notifications"
    })
  },
  Profile: {
    screen: stackFactory(Profile, {
      title: "Profile"
    })
  }
});
