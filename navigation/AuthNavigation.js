import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Signup from "../screens/Auth/Signup";
import Login from "../screens/Auth/Login";
import Confirm from "../screens/Auth/Confirm";
import AuthHome from "../screens/Auth/AuthHome";

const AuthNavigation = createStackNavigator(
  // route 정하는거랑 비슷
  // #기본 작성
  //  AuthHome : {
  //    screen: AuthHome
  //  }
  //다음은 shortcut
  {
    Signup,
    Login,
    Confirm,
    AuthHome
  },
  {
    headerMode: "none"
  }
);

// navigaton 을 렌더 하기위해선 createAppContainer을 이용하여 export 해야한다.
export default createAppContainer(AuthNavigation);
