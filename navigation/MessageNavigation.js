import { createStackNavigator } from "react-navigation-stack";
import SearchUser from "../screens/Message/SearchUser";
import ChatRoom from "../screens/Message/ChatRoom";
import { stackStyles } from "./config";
import SeeRooms from "../screens/Message/SeeRooms";

export default createStackNavigator(
  {
    SeeRooms: {
      screen: SeeRooms,
      navigationOptions: {
        title: "채팅방"
      }
    },
    SearchUser: {
      screen: SearchUser,
      navigationOptions: {
        title: "대화상대 찾기"
      }
    },
    ChatRoom: {
      screen: ChatRoom,
      navigationOptions: {
        title: "대화중"
      }
    }
  },
  {
    defaultNavigationOptions: {
      headerStyle: { ...stackStyles }
    }
  }
);
