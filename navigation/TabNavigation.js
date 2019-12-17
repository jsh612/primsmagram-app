import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Home from "../screens/Home";
import Search from "../screens/Search";
import Notifications from "../screens/Notifications";
import Profile from "../screens/Profile";
import { View } from "react-native";

export default createBottomTabNavigator({
  // #route 정하는거랑 비슷
  // #기본 작성
  //  Home : {
  //    screen: Home
  //  }
  //다음은 shortcut
  Home,
  Search,
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
  Notifications,
  Profile
});
