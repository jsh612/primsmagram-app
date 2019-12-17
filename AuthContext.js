import React, { createContext, useContext, useState } from "react";
import { AsyncStorage } from "react-native";

//context는 object인데 useContext를 통해서 어디서든 접근 가능
export const AuthContext = createContext();

/* 

  AuthProvider -> context.provider 컴포넌트 출력

 */
export const AuthProvider = ({ isLoggedIn: isLoggedInProp, children }) => {
  // #Provider는 context를 구독하는 컴포넌트들에게 context의 변화를 알리는 역할을 합니다.
  // #props.children
  //  모든 컴포넌트에서 props.children를 사용할 수 있습니다.
  //  props.children은 컴포넌트의 여는 태그와 닫는 태그 사이의 내용을 포함합니다

  // #로그인, 로그아웃 여부 확인
  // -null: 아직 확인전 , -false: 로그인안됨, -true: 로그인된 상태
  // (null 의 이유: 아직 확인 하지 않은 경우를 포함 시키기 위해)
  const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInProp);

  const logUserIn = async () => {
    try {
      await AsyncStorage.setItem("isLoggedIn", "true"); //key value 모두 string
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
  };

  const logUserOut = async () => {
    try {
      await AsyncStorage.setItem("isLoggedIn", "false"); //key value 모두 string
      setIsLoggedIn(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logUserIn, logUserOut }}>
      {children}
    </AuthContext.Provider>
  );
};

/* 

   useContext를 이용한 함수들 -> 해당 함수를 이용하여 다른 컴포넌트에서 context 접근가능

 */
export const useIsLoggedIn = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn;
};

export const useLogIn = () => {
  const { logUserIn } = useContext(AuthContext);
  return logUserIn;
};

export const useLogOut = () => {
  const { logUserOut } = useContext(AuthContext);
  console.log("logUserOut", logUserOut);
  return logUserOut;
};
