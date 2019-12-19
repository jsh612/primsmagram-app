import React, { useState } from "react";
import styled from "styled-components";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { useMutation } from "@apollo/react-hooks";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { LOG_IN } from "../Auth/AuthQueries";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default ({ navigation }) => {
  const emailInput = useInput("");
  const [loading, setLoading] = useState(false);

  const [requestSecret] = useMutation(LOG_IN, {
    variables: {
      email: emailInput.value
    }
  });

  const handleLogin = async () => {
    const { value } = emailInput;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value === "") {
      return Alert.alert("email을 작성해주세요");
    } else if (!value.includes("@") || !value.includes(".")) {
      return Alert.alert("올바른 email이 아닙니다.");
    } else if (!emailRegex.test(value)) {
      return Alert.alert("해당 email은 유효하지 않습니다.");
    }
    try {
      setLoading(true);
      await requestSecret();
      Alert.alert("당신의 메일함을 확인해주세요");
      navigation.navigate("Confirm");
    } catch (error) {
      console.log("Login.js : ", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthInput
          {...emailInput}
          placeholder={"Email"}
          keyboardType={"email-address"}
          returnKeyType="send"
          onEndEditing={handleLogin}
          autoCorrect={false}
        />
        <AuthButton loading={loading} text={"Log in"} onPress={handleLogin} />
      </View>
    </TouchableWithoutFeedback>
  );
};
