import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import TabNavigation from "./TabNavigation";
import PhotoNavigation from "./PhotoNavigation";
import MessageNavigation from "./MessageNavigation";
import { stackStyles } from "./config";

const MainNavigation = createStackNavigator(
  {
    // #route 정하는거랑 비슷
    TabNavigation,
    PhotoNavigation,
    MessageNavigation
  },
  {
    headerMode: "none",
    mode: "modal", // mode --> 화면전환 스타일 설정
    defaultNavigationOptions: {
      headerStyle: {
        ...stackStyles
      }
    }
  }
);

export default createAppContainer(MainNavigation);
