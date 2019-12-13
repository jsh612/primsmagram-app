import React from "react";
import { Text } from "react-native";
import { useIsLoggedIn, useLogIn } from "../AuthContext";

export default () => {
  const isLoggerIn = useIsLoggedIn();
  return <Text>NavController</Text>;
};
