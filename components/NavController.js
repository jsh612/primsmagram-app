import React from "react";
import { useIsLoggedIn } from "../AuthContext";
import AuthNavigation from "../navigation/AuthNavigation";
import MainNavigation from "../navigation/MainNavigation";

export default () => {
  const isLoggedIn = useIsLoggedIn();
  // return isLoggedIn ? <MainNavigation /> : <AuthNavigation />; // 잠시 주석처리
  return <MainNavigation />; // 임시 코드
};
