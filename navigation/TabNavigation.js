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
import { stackStyles } from "./config";
import Detail from "../screens/PostDetail";
import UserDetail from "../screens/UserDetail";

const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator(
    {
      InitialRoute: {
        screen: initialRoute,
        navigationOptions: {
          ...customConfig,
          headerStyle: { ...stackStyles }
        }
      },
      Detail: {
        screen: Detail,
        navigationOptions: {
          headerTintColor: styles.blackColor,
          title: "Post"
        }
      },
      UserDetail: {
        screen: UserDetail,
        navigationOptions: ({ navigation }) => ({
          title: navigation.getParam("username")
        })
      }
    },
    {
      defaultNavigationOptions: {
        headerBackTitle: null,
        headerTintColor: styles.blackColor,
        headerStyle: { ...stackStyles }
      }
    }
  );

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
        // back 버튼 string 없애기
        // 돌아가는 화면에서 설정 한다.(Detail의 빽버튼은 돌아오는 Search 화면에서 설정)
        headerBackTitle: null
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
            name={
              Platform.OS === "ios"
                ? "ios-add-circle-outline"
                : "md-add-circle-outline"
            }
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
    initialRouteName: "Profile", //작업할 때 편하기 위해 일시적으로 설정 해둠
    tabBarOptions: {
      showLabel: false,
      style: {
        backgroundColor: "#FAFAFA"
      }
    }
  }
);
