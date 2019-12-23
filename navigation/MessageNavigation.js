import { createStackNavigator } from "react-navigation-stack";
import Messaage from "../screens/Message/Message";
import Messaages from "../screens/Message/Messages";
import { stackStyles } from "./config";

export default createStackNavigator(
  {
    Messaage,
    Messaages
  },
  {
    defaultNavigationOptions: {
      headerStyle: { ...stackStyles }
    }
  }
);
