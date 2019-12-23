import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { View, Platform } from "react-native";
import Home from "../screens/Tabs/Home";
import Search from "../screens/Tabs/Search";
import Notifications from "../screens/Tabs/Notifications";
import Profile from "../screens/Tabs/Profile";
import MessagesLink from "../components/MessagesLink";
import NavIcon from "../components/NavIcon";
import styles from "../styles";

const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator({
    InitialRoute: {
      screen: initialRoute,
      navigationOptions: {
        ...customConfig,
        headerStyle: { backgroundColor: "#EFEEEF" }
      }
    }
  });

export default createBottomTabNavigator(
  {
    // # route 정하는거랑 비슷
    // # Tab 에 Stack 넣기
    //   https://reactnavigation.org/docs/en/tab-based-navigation.html#a-stack-navigator-for-each-tab
    Home: {
      screen: stackFactory(Home, {
        headerTitle: (
          //headerTitle --> 해당 tab의 header로 태그,컴퍼넌트 사용 가능
          <NavIcon size={26} name={"logo-instagram"} size={45} />
        ),
        headerRight: <MessagesLink />
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            size={26}
            name={Platform.OS === "ios" ? "ios-home" : "md-home"}
            focused={focused}
            color={styles.blueColor}
          />
        )
      }
    },
    Search: {
      screen: stackFactory(Search, {
        title: "Search"
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            size={26}
            name={Platform.OS === "ios" ? "ios-search" : "md-search"}
            focused={focused}
            color={styles.blueColor}
          />
        )
      }
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
        // {/* navigation.navigate(“[라우트이름 or 스크린이름]”) */}
        tabBarOnPress: ({ navigation }) =>
          navigation.navigate("PhotoNavigation"),
        tabBarIcon: (
          <NavIcon
            size={26}
            name={Platform.OS === "ios" ? "ios-add" : "md-add"}
          />
        )
      }
    },
    Notifications: {
      screen: stackFactory(Notifications, {
        title: "Notifications"
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            size={26}
            name={
              Platform.OS === "ios"
                ? focused
                  ? "ios-heart"
                  : "ios-heart-empty"
                : focused
                ? "md-heart"
                : "md-heart-empty"
            }
            focused={focused}
            color={styles.blueColor}
          />
        )
      }
    },
    Profile: {
      screen: stackFactory(Profile, {
        title: "Profile"
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            size={26}
            name={Platform.OS === "ios" ? "ios-person" : "md-person"}
            focused={focused}
            color={styles.blueColor}
          />
        )
      }
    }
  },
  {
    tabBarOptions: {
      showLabel: false,
      style: {
        backgroundColor: "#EFEEEF"
      }
    }
  }
);
